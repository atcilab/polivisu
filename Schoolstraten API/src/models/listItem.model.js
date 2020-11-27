const mongoose = require("mongoose");
const { MainSchema } = require("./main.model");
const { WeatherSchema } = require("./weather.model");
const { CloudSchema } = require("./cloud.model");
const { WindSchema } = require("./wind.model");
const { SysSchema } = require("./sys.model");

const ListITemSchema = mongoose.Schema(
  {
    dt: { type: Number },
    main: { type: MainSchema },
    weather: { type: [WeatherSchema] },
    clouds: { type: CloudSchema },
    wind: { type: WindSchema },
    sys: { type: SysSchema },
    dt_txt: { type: String }
  },
  { _id: false }
);

const ListItemModel = mongoose.model("ListItem", ListITemSchema);

module.exports = { ListITemSchema, ListItemModel };
