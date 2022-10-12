const asyncForEach = require("../../../utils/asyncForEach");
const Matrix = require("../models/Matrix");

exports.point_first_span = (diameter,item) => {
    const first = item.spans.find(it=>{it.span_position==1});
    return first.span_diameter == diameter;
}

exports.point_last_span = (diameter,length,item) => {
    const last = item.spans.find(it=>{it.span_position==item.spans.length});
    return last.span_diameter == diameter && last.length.length == length;
}

