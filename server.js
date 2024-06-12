const express = require('express');
const cors = require('cors');
const { RuleEngine } = require('node-rules');

const app = express();
app.use(cors());

// Simulated data
const wasteGenerationData = [
  { area: 'Residential', wasteAmount: 500 },
  { area: 'Commercial', wasteAmount: 800 },
  { area: 'Industrial', wasteAmount: 1200 }
];

const wasteSegregationData = [
  { area: 'Residential', segregationRate: 0.6 },
  { area: 'Commercial', segregationRate: 0.4 },
  { area: 'Industrial', segregationRate: 0.2 }
];

const recyclingData = [
  { area: 'Residential', recyclingRate: 0.3 },
  { area: 'Commercial', recyclingRate: 0.2 },
  { area: 'Industrial', recyclingRate: 0.1 }
];

const landfillData = [
  { area: 'Residential', landfillUsage: 0.2 },
  { area: 'Commercial', landfillUsage: 0.3 },
  { area: 'Industrial', landfillUsage: 0.5 }
];

const rules = [
  {
    condition: function(R) {
      R.when(this.wasteAmount > 1000);
    },
    consequence: function(R) {
      this.result = 'High waste generation detected';
      this.action = 'Implement waste reduction measures';
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.segregationRate < 0.5);
    },
    consequence: function(R) {
      this.result = 'Low waste segregation rate detected';
      this.action = 'Enhance waste segregation practices';
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.recyclingRate < 0.2);
    },
    consequence: function(R) {
      this.result = 'Low recycling rate detected';
      this.action = 'Promote recycling awareness campaigns';
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.landfillUsage > 0.4);
    },
    consequence: function(R) {
      this.result = 'High landfill usage detected';
      this.action = 'Implement landfill diversion strategies';
      R.stop();
    }
  }
];

const R = new RuleEngine(rules);

app.get('/recommendations/:area', async (req, res) => {
  const area = req.params.area;
  const recommendations = [];

  const relevantWasteGenerationData = wasteGenerationData.find(data => data.area === area);
  const relevantSegregationData = wasteSegregationData.find(data => data.area === area);
  const relevantRecyclingData = recyclingData.find(data => data.area === area);
  const relevantLandfillData = landfillData.find(data => data.area === area);

  R.execute(relevantWasteGenerationData, result => {
    if (result.result) {
      recommendations.push(result);
    }
  });

  R.execute(relevantSegregationData, result => {
    if (result.result) {
      recommendations.push(result);
    }
  });

  R.execute(relevantRecyclingData, result => {
    if (result.result) {
      recommendations.push(result);
    }
  });

  R.execute(relevantLandfillData, result => {
    if (result.result) {
      recommendations.push(result);
    }
  });

  setTimeout(() => {
    res.json(recommendations);
  }, 100);
});

const PORT = 5017;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
