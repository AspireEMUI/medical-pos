# 🎯 MEDICAL STORE POS - INTERACTIVE DEMO GUIDE

## 🌐 ACCESS THE SYSTEM NOW

### Frontend Web Interface
**Open in your browser:** http://localhost:3000

### Backend API
**Base URL:** http://localhost:5000

---

## 📋 WHAT YOU CAN DO RIGHT NOW

### 1. View the Dashboard
- Click on "Dashboard" in the menu
- See today's sales: **₹720.80** from 2 transactions
- View inventory value: **₹24,970**
- Check low stock items and expired medicines

### 2. Manage Inventory
- Click "Inventory" → View all 5 medicines in stock
- Try: **Add Medicine** button to add new items
- Edit existing medicines
- Delete items (or mark as out of stock)

### 3. Process a Sale
- Click "Checkout"
- Search for medicines (try: "Aspirin", "Vitamin")
- Add to cart by clicking medicine cards
- Adjust quantities with +/- buttons
- Apply discount (optional)
- Select payment method
- Click "Complete Checkout"

### 4. Manage Customers
- Click "Customers"
- View: Raj Kumar, Priya Sharma
- Add new customers
- Edit or delete customer records

### 5. View Reports
- Click "Reports"
- See daily sales summary
- View top-selling medicines
- Check revenue metrics

---

## 🧪 TEST SCENARIOS

### Scenario 1: Quick Sale (2 minutes)
1. Go to Checkout
2. Search "Paracetamol"
3. Add 1 unit to cart
4. Click Complete Checkout
5. Watch inventory update automatically

### Scenario 2: Complex Sale (3 minutes)
1. Checkout
2. Add 3 different medicines
3. Set quantities
4. Apply ₹50 discount
5. Complete sale
6. Check Reports - see updated top medicines

### Scenario 3: Add New Medicine (2 minutes)
1. Go to Inventory
2. Click "Add Medicine"
3. Fill form:
   - Name: "Insulin Injection"
   - Category: "Injection"
   - Price: 250
   - Quantity: 30
4. Click Save
5. See it appear in inventory list

---

## 📊 CURRENT SYSTEM STATE

### Medicines in Stock
| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Paracetamol 650mg | ₹45 | 148 | ✅ Available |
| Amoxicillin 500mg | ₹120 | 79 | ✅ Available |
| Vitamin C 500mg | ₹30 | 197 | ✅ Available |
| Cough Syrup | ₹85 | 48 | ✅ Available |
| Aspirin 500mg | ₹50 | 95 | ✅ Available |

### Recent Sales
- **Today's Revenue:** ₹720.80
- **Transactions:** 2
- **Average Sale:** ₹360.40

### Customers
- Raj Kumar (Cash payment: ₹308.80)
- Priya Sharma (Card payment: ₹412.00)

---

## 🔌 API TESTING (Command Line)

### Test 1: Get All Medicines
```bash
curl http://localhost:5000/api/medicines
```

### Test 2: Create a Sale
```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": null,
    "items": [
      {"medicine_id": "ID_HERE", "quantity": 1, "unit_price": 45, "total": 45}
    ],
    "discount": 0,
    "tax": 5,
    "payment_method": "cash"
  }'
```

### Test 3: Get Daily Report
```bash
curl "http://localhost:5000/api/sales/report/daily?date=2026-07-12"
```

### Test 4: Get Top Medicines
```bash
curl http://localhost:5000/api/sales/report/top-medicines
```

---

## 🎮 LIVE DEMO FLOW (5 minutes)

1. **[1 min]** Open http://localhost:3000
   - Explore Dashboard
   - Notice today's sales stats

2. **[1 min]** Go to Inventory
   - See all medicines
   - Note the stock levels

3. **[2 min]** Go to Checkout
   - Search "Paracetamol"
   - Add 2 units
   - Add discount of ₹20
   - Complete checkout
   - Watch inventory update in real-time

4. **[1 min]** Check Reports
   - See updated sales total
   - View top medicines list

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:3000)
- [ ] Can see Dashboard with sales data
- [ ] Can view Inventory list
- [ ] Can complete a checkout
- [ ] Can view Reports
- [ ] Can add new customer
- [ ] API endpoints responding

---

## 🛠️ TROUBLESHOOTING

### Frontend not loading?
```bash
# Restart frontend
cd frontend
npm start
```

### Backend not responding?
```bash
# Restart backend
cd backend
npm start
```

### Database reset needed?
```bash
# Delete database file
rm backend/medical_pos.db

# Restart backend to recreate
cd backend
npm start
```

### Port already in use?
- Backend (5000): Change PORT in .env
- Frontend (3000): Change PORT environment variable

---

## 📁 FILE LOCATIONS

- **Project Root:** `C:\Users\Pc\Desktop\Agentic AI2\medical-pos\`
- **Backend:** `C:\Users\Pc\Desktop\Agentic AI2\medical-pos\backend\`
- **Frontend:** `C:\Users\Pc\Desktop\Agentic AI2\medical-pos\frontend\`
- **Database:** `C:\Users\Pc\Desktop\Agentic AI2\medical-pos\backend\medical_pos.db`

---

## 🚀 READY TO USE!

The system is **fully operational** and ready for:

✅ Sales processing
✅ Inventory management
✅ Customer tracking
✅ Analytics and reporting
✅ Real-time data updates

---

## 💡 NEXT STEPS FOR OWNER

After using the system:

1. **Feedback** - What features need improvement?
2. **Enhancements** - What would make it more useful?
3. **Customization** - Any business-specific needs?
4. **Integration** - Need to connect with other systems?

**All changes can be implemented based on actual usage.**

---

**Status: ✅ LIVE AND READY**

Start using the system now. Both servers are running!

🌐 Frontend: http://localhost:3000
⚙️ Backend: http://localhost:5000
