const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
// const { errorHandler } = require('./middleware/error.middleware');
const errorHandler = () => {};

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Stripe webhook needs raw body — register BEFORE express.json()
app.use('/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  require('./webhooks/stripe.webhook').handleStripeWebhook
);

// Routes (add as you build each feature)
// app.use('/api/v1/auth',     require('./routes/auth.routes'));
// app.use('/api/v1/products', require('./routes/product.routes'));
// app.use('/api/v1/cart',     require('./routes/cart.routes'));
// app.use('/api/v1/orders',   require('./routes/order.routes'));
// app.use('/api/v1/reviews',  require('./routes/review.routes'));
// app.use('/api/v1/payments', require('./routes/payment.routes'));
// app.use('/api/v1/chat',     require('./routes/chat.routes'));
// app.use('/api/v1/admin',    require('./routes/admin.routes'));
// app.use('/api/v1/users',    require('./routes/user.routes'));

app.use(errorHandler);
module.exports = app;
