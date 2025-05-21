const express = require('express');
const router = express.Router();
const {
  make_order,
  view_order,
  admin_view_all_orders,
  admin_update_order_status,
  fetch_user_address,
  cancelOrder,
  reOrder,
  changeAddress
} = require('../controllers/Order.controller');

router.post('/', make_order);
router.get('/', view_order);
router.get('/userAddress', fetch_user_address);
router.post('/cancel/:orderId', cancelOrder);
router.post('/reorder/:orderId', reOrder);
router.post('/changeAddress', changeAddress);

// Admin Routes
router.get('/admin/all', admin_view_all_orders);
router.put('/admin/status', admin_update_order_status);

module.exports = router;
