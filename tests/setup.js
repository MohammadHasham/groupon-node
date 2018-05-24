jest.setTimeout(90000);
require('../models/User');

const mongoose = require("mongoose");


mongoose.connect("mongodb://admin:admin@ds215910.mlab.com:15910/groupon");
