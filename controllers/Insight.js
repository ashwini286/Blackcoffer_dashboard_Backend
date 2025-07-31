
import Insight from "../models/insightSchema.js";

// Get all insights (without filters)
export const getAllInsights = async (req, res) => {
  try {
    const insights = await Insight.find();
    res.json(insights);
    console.log(`Found  insights, total: ${insights.length}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get filtered insights (based on query parameters)
export const getFilteredInsights = async (req, res) => {
  try {
    const {
      sector,
      topic,
      region,
      country,
      source,
      start_year,
      end_year
    } = req.query;

    const filter = {};
    const pipeline = [];

    // Single value filters with exact matching
    if (sector) {
      filter.sector = sector.trim();
    }
    if (topic) {
      filter.topic = topic.trim();
    }
    if (region) {
      filter.region = region.trim();
    }
    if (country) {
      filter.country = country.trim();
    }
    if (source) {
      filter.source = source.trim();
    }

    // Add match stage for basic filters
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    // Year logic - handle string to number conversion
    const yearFilter = { $and: [] };

    if (start_year && !end_year) {
      yearFilter.$and.push({
        $expr: {
          $and: [
            { $ne: ["$start_year", ""] },
            { $ne: ["$start_year", null] },
            { $gte: [{ $toInt: "$start_year" }, parseInt(start_year)] }
          ]
        }
      });
    } else if (!start_year && end_year) {
      yearFilter.$and.push({
        $expr: {
          $and: [
            { $ne: ["$end_year", ""] },
            { $ne: ["$end_year", null] },
            { $lte: [{ $toInt: "$end_year" }, parseInt(end_year)] }
          ]
        }
      });
    } else if (start_year && end_year) {
      yearFilter.$and.push({
        $expr: {
          $and: [
            { $ne: ["$start_year", ""] },
            { $ne: ["$start_year", null] },
            { $gte: [{ $toInt: "$start_year" }, parseInt(start_year)] }
          ]
        }
      });
      yearFilter.$and.push({
        $expr: {
          $and: [
            { $ne: ["$end_year", ""] },
            { $ne: ["$end_year", null] },
            { $lte: [{ $toInt: "$end_year" }, parseInt(end_year)] }
          ]
        }
      });
    }

    // Add year filter if any year conditions exist
    if (yearFilter.$and.length > 0) {
      pipeline.push({ $match: yearFilter });
    }

    console.log('Applied pipeline:', JSON.stringify(pipeline, null, 2));

    // Use aggregation if we have year filters, otherwise use find
    let filteredInsights;
    if (pipeline.length > 0) {
      filteredInsights = await Insight.aggregate(pipeline);
    } else {
      filteredInsights = await Insight.find({});
    }
    
    console.log(`Found ${filteredInsights.length} documents matching filters`);
    
    res.json({
      success: true,
      count: filteredInsights.length,
      pipeline: pipeline,
      data: filteredInsights
    });
  } catch (error) {
    console.error('Error in getFilteredInsights:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getAllUniqueValues = async (req, res) => {
  try {

    const [sectors, topics, regions, countries, sources] = await Promise.all([
      Insight.distinct('sector'),
      Insight.distinct('topic'),
      Insight.distinct('region'),
      Insight.distinct('country'),
      Insight.distinct('source')
    ]);

    const filterValidValues = (array) => {
      return array.filter(item => 
        item !== null && 
        item !== undefined && 
        item !== '' && 
        item.toString().trim() !== ''
      ).sort();
    };

    const filteredSectors = filterValidValues(sectors);
    const filteredTopics = filterValidValues(topics);
    const filteredRegions = filterValidValues(regions);
    const filteredCountries = filterValidValues(countries);
    const filteredSources = filterValidValues(sources);
    console.log('Filtered results:', {
      sectorsCount: filteredSectors.length,
      topicsCount: filteredTopics.length,
      regionsCount: filteredRegions.length,
      countriesCount: filteredCountries.length,
      sourcesCount: filteredSources.length
    });

    res.json({
      sectors: filteredSectors,
      topics: filteredTopics,
      regions: filteredRegions,
      countries: filteredCountries,
      sources: filteredSources
    });
  } catch (error) {
    console.error('Error in getAllUniqueValues:', error);
    res.status(500).json({ message: error.message });
  }
};