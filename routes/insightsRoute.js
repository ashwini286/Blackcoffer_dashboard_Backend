
import express from "express";
import {
  getAllInsights,
  getFilteredInsights,
  getAllUniqueValues,
} from "../controllers/Insight.js";

const router = express.Router();


// Route to get all insights
router.get("/all", getAllInsights);

// Route to get filtered insights
router.get("/filters", getFilteredInsights);

// Route to get all unique values(sectors, topics, regions, countries, sources, start_year, end_year,)
router.get("/unique-values", getAllUniqueValues);



export default router;
