import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const CampaignStats = ({ stats }) => {
  return (
    <Card className="bg-[#23233d] rounded-lg shadow-lg">
      <CardContent>
        <Typography variant="h6" className="text-white mb-4">📅 Campaign Stats</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography className="text-green-400 text-xl">🟢 {stats.active}</Typography>
            <Typography className="text-gray-300">Active Campaigns</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className="text-red-400 text-xl">🔴 {stats.expired}</Typography>
            <Typography className="text-gray-300">Expired Campaigns</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CampaignStats;
