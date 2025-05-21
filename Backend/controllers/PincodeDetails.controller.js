const mongoose=require('mongoose')
const pincode_details=require('../models/PincodeDetails.models');

const get_details_from_pincode = async (req, res) => {
  try {
    let { state, district } = req.params;

    // Convert to uppercase for matching
    state = state.toUpperCase();
    district = district.toUpperCase();

    // 1️⃣ First try to find exact match (STATE + DISTRICT)
    let result = await pincode_details.findOne({ STATE: state, DISTRICT: district });

    if (result) {
      // Ensure rainfall is a number
      result = {
        ...result._doc,
        ANNUAL_RAINFALL: parseFloat(result.ANNUAL_RAINFALL),
      };
      return res.status(200).json({data:result,response:true});
    }

    // 2️⃣ If no district match, fallback to STATE only
    const stateResults = await pincode_details.find({ STATE: state });

    if (!stateResults.length) {
      return res.status(404).json({ message: "No data found for the given state.",response:false });
    }

    // Convert all rainfall to float and collect soil & zone values
    let totalRainfall = 0;
    let totalUV = 0;
    let countRain = 0;
    let countUV = 0;

    const soilCount = {};
    const zoneCount = {};

    stateResults.forEach((doc) => {
      // Rainfall
      const rainfall = parseFloat(doc.ANNUAL_RAINFALL);
      if (!isNaN(rainfall)) {
        totalRainfall += rainfall;
        countRain++;
      }
      // UV Index
      if (doc.UV_INDEX !== undefined && doc.UV_INDEX !== null) {
        const uv = Number(doc.UV_INDEX);
        if (!isNaN(uv)) {
          totalUV += uv;
          countUV++;
        } else {
          console.log(`Invalid UV_INDEX value:`, doc.UV_INDEX);
        }
      } else {
        console.log(`Missing UV_INDEX in document for ${doc.DISTRICT} ${doc.UV_INDEX}`);
      }

      // Soil & Zone
      const soil = doc.SOIL?.toUpperCase();
      const zone = doc.ZONE?.toUpperCase();

      if (soil) soilCount[soil] = (soilCount[soil] || 0) + 1;
      if (zone) zoneCount[zone] = (zoneCount[zone] || 0) + 1;
    });

    const meanRainfall = countRain ? (totalRainfall / countRain).toFixed(2) : null;
    const meanUV = countUV ? (totalUV / countUV).toFixed(2) : null;

    // Get most frequent soil and zone
    const getMostFrequent = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0];

    const mostCommonSoil = getMostFrequent(soilCount);
    const mostCommonZone = getMostFrequent(zoneCount);

    return res.status(200).json({ data: {
      STATE: state,
      DISTRICT: district,
      ANNUAL_RAINFALL: parseFloat(meanRainfall),
      UV_INDEX: meanUV,
      SOIL: mostCommonSoil || "Unknown",
      ZONE: mostCommonZone || "Unknown",
    },response:true});
  } catch (err) {
    console.error("Error fetching rainfall data:", err);
    return res.status(500).json({ error: "Internal Server Error" ,response:false});
  }
  };

module.exports=get_details_from_pincode