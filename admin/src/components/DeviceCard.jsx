import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';

function DeviceCard() {
	return (
		<Card
			sx={{
				width: '300px',
				minHeight: '300px',
				borderRadius: '4px',
				backgroundColor: '#FFF',
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Box sx={{ borderRadius: '18px 18px 0 0', overflow: 'hidden' }}>
				<CardMedia
					component="img"
					src="https://via.placeholder.com/400x250"
					sx={{ width: '100%', height: 'auto', display: 'block' }}
				/>
			</Box>
			<CardContent sx={{ padding: '16px' }}>
				<Typography variant="h3" component="h3" sx={{ color: '#333', fontSize: '20px', margin: '0 0 8px' }}>
					Device Name
				</Typography>
				<Typography variant="body1" sx={{ color: '#888', fontSize: '16px', margin: '0 0 16px' }}>
					Description of the device. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</Typography>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button
						sx={{
							backgroundColor: '#4caf50',
							color: '#FFF',
							border: 'none',
							borderRadius: '4px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							padding: '8px 16px',
							fontSize: '16px',
							cursor: 'pointer',
						}}
					>
						View Details
					</Button>
					<Button
						sx={{
							backgroundColor: '#f44336',
							color: '#FFF',
							border: 'none',
							borderRadius: '4px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							padding: '8px 16px',
							fontSize: '16px',
							cursor: 'pointer',
						}}
					>
						Remove Device
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}

export default DeviceCard;
