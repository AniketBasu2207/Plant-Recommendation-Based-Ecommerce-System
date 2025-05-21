import React from "react";
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Cart and Wishlist Buttons */}
      <Box display="flex" justifyContent="start" mb={2}>
        <Skeleton sx={{ mr: 2 }} variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={140} height={40} />
      </Box>

      {/* Success Message Placeholder */}
      <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />

      {/* Growing Requirements Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="50%" height={30} />
          <Skeleton variant="text" width="30%" height={25} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </CardContent>
      </Card>

      {/* Recommended Plants Section */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        <Skeleton width={180} />
      </Typography>

      <Grid container spacing={2}>
        {[1, 2, 3].map((i) => (
          <Grid item key={i}>
            <Card sx={{ width: 110, p: 1 }}>
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{ mx: "auto", my: 1 }}
              />
              <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="50%" sx={{ mx: "auto" }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoadingSkeleton;
