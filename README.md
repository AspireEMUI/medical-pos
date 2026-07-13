# Medical Store POS System

A complete Point of Sale system for medical stores built with Node.js, Express, React, and SQLite.

## Features

- **Inventory Management**: Add, edit, and manage medicines with expiry tracking
- **Checkout System**: Fast and intuitive checkout with cart management
- **Customer Management**: Maintain customer database for loyalty and sales tracking
- **Sales & Billing**: Complete billing system with discount and tax support
- **Reports & Analytics**: Daily sales reports, top-selling medicines, and revenue tracking
- **Stock Alerts**: Low stock and expired medicine alerts
- **Multi-payment Support**: Cash, card, and digital wallet options

## System Architecture

```
medical-pos/
├── backend/              # Node.js/Express API
│   ├── db.js            # SQLite database setup
│   ├── server.js        # Main server file
│   ├── package.json
│   ├── .env
│   └── routes/
│       ├── medicines.js
│       ├── customers.js
│       └── sales.js
└── frontend/            # React application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   ├── components/
    │   │   └── Sidebar.js
    │   └── pages/
    │       ├── Dashboard.js
    │       ├── Inventory.js
    │       ├── Checkout.js
    │       ├── Customers.js
    │       └── Reports.js
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/stock/low` - Get low stock medicines
- `GET /api/medicines/stock/expired` - Get expired medicines

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID with items
- `POST /api/sales` - Create new sale (checkout)
- `GET /api/sales/report/daily` - Get daily sales report
- `GET /api/sales/report/monthly` - Get monthly sales report
- `GET /api/sales/report/top-medicines` - Get top selling medicines

## Database

The system uses SQLite with the following tables:

- **medicines** - Store medicine inventory
- **customers** - Store customer information
- **sales** - Store transaction records
- **sale_items** - Store individual items in each sale
- **stock_history** - Track inventory changes

The database file `medical_pos.db` is automatically created in the backend directory on first run.

## Usage

1. **Add Medicines**: Go to Inventory page and add medicines with details like name, category, price, quantity, expiry date, SKU, manufacturer, and batch number.

2. **Manage Customers**: Add customer information in the Customers section for loyalty tracking.

3. **Process Sale**: 
   - Go to Checkout page
   - Search and add medicines to cart
   - Adjust quantities as needed
   - Apply discounts and tax if applicable
   - Select payment method
   - Complete checkout

4. **View Reports**: Access sales analytics, top-selling medicines, and daily/monthly reports from the Reports page.

5. **Monitor Inventory**: Dashboard shows low stock items and expired medicines that need attention.

## Future Enhancements

The following features can be added based on owner requirements:

- Barcode scanning support
- Prescription management
- Multi-store support
- Advanced reporting and analytics
- Staff and user management
- Payment gateway integration
- Mobile app
- Email and SMS notifications
- Data backup and recovery
- User authentication and roles
- Integration with pharmaceutical suppliers

## Configuration

Edit the backend `.env` file to configure:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

**Backend won't start:**
- Ensure Node.js is installed: `node --version`
- Check if port 5000 is in use
- Delete `medical_pos.db` and restart to reset the database

**Frontend won't connect to backend:**
- Verify backend is running on `http://localhost:5000`
- Check that CORS is enabled in `server.js`
- Clear browser cache and refresh

**Database issues:**
- The database is automatically created on first run
- To reset, delete `backend/medical_pos.db` and restart the server

## Support

For any issues or feature requests, contact the development team.

## License

Proprietary - For Medical Store Use
