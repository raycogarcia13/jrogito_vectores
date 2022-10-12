
const ObjectMachine = require('../models/ObjectMachine')
const MotorSpeed = require('../models/MotorSpeed')
const Tires = require('../models/Tires')
const GearBox = require('../models/GearBox')
const Diameter = require('../models/Diameter')
const LengthSpan = require('../models/LengthSpan')
const Length = require('../models/Length')

const asyncForEach = require('../../../utils/asyncForEach')
const {change_unit} = require('./units_measure')

// -1 => Not pivot
// -2 => not frecuency setted 
// -3 => not last motor_speed setted 
// -4 => not tires setted
// -5 => not gearbox setted
const maximum_speed = async (pivot) => {
    
    const elec_pow_fr = ( pivot.control && pivot.control.electrical_power ) ? pivot.control.electrical_power.frecuency : null
    const frec = elec_pow_fr || pivot.generalFeatures.frecuency
    if(!frec)
        return -2

    const lmotor_span = (pivot.spans.spans[pivot.spans.spans.length-1] && pivot.spans.spans[pivot.spans.spans.length-1].drive_train)?pivot.spans.spans[pivot.spans.spans.length-1].drive_train.motor_speed:null;
    let motor_s = lmotor_span || pivot.generalFeatures.lmotor_speed  
    if(!motor_s)
        return -3
    motor_s = await MotorSpeed.findById(motor_s);
    if(!motor_s)
        return -3
    const rpm = frec=='50Hz' ? motor_s.rpm.f50 : motor_s.rpm.f60
    
    const ltires = (pivot.spans.spans[pivot.spans.spans.length-1] && pivot.spans.spans[pivot.spans.spans.length-1].drive_train)?pivot.spans.spans[pivot.spans.spans.length-1].drive_train.tires:null;
    let tires = ltires || pivot.generalFeatures.ltires
    if(!tires)
        return -4
    tires = await Tires.findById(tires);
    if(!tires)
        return -4
    const perimeter = tires.perimeter

    const lgearbox = (pivot.spans.spans[pivot.spans.spans.length-1] && pivot.spans.spans[pivot.spans.spans.length-1].drive_train)?pivot.spans.spans[pivot.spans.spans.length-1].drive_train.gearbox:null;
    let gearbox = lgearbox || pivot.generalFeatures.gearbox
    if(!gearbox)
        return -5
    gearbox = await GearBox.findById(gearbox);
    if(!gearbox)
        return -5
    let box = gearbox.value
    box = box.split(' ')[1].split("/")[0]

    const max_speed = rpm * perimeter / box;

    pivot.generalFeatures.lmotor_max_speed = {
        value:max_speed,
        um: "m/min"
    }

    await pivot.save()

    return {
        value:max_speed,
        um: "m/min"
    }
}
exports.maximum_speed = maximum_speed;

const radious_without_oh = async (pivot) => {
 
    let oh_l = (pivot.spans.overhang.oh_length && pivot.spans.overhang.oh_length.length) ? pivot.spans.overhang.oh_length.length.split('m')[0]:0;
    let length = pivot.spans.length || pivot.generalFeatures.target_radius 
    return length - oh_l;

}
exports.radious_without_oh = radious_without_oh;

const time_lap = async (pivot) => {

    const length_pivot = await radious_without_oh(pivot);

    const L = 2 * Math.PI * length_pivot

    const speed = await maximum_speed(pivot);

    const angle = pivot.generalFeatures.spia / 360

    const H = L * angle / 60 / speed.value

    pivot.generalFeatures.irrig_cap.time_lap = {
        value:H,
        um:'h'
    };
    await pivot.save()

    return {
        value:H,
        um:'h'
    }

}
exports.time_lap = time_lap;

const depth_app = async (pivot) => {

   const f = pivot.generalFeatures.irrig_cap.flow.find(it=>it.default == true)
   if(f.um !='l/s')
        flow = {
            vlaue : await change_unit(flow.value,flow.um,'l/s'),
            um:'l/s'
        }
    else
        flow = f
    const h = await time_lap(pivot)

    const Haeqv = pivot.generalFeatures.irrig_eqvarea.value

    let I = {
        value: flow.value * 3.6 * h.value / Haeqv /10,
        um:"mm"
    }

    if(f.um == 'GPM'){
        I.value = I / 25.4
        I.um = "inch"
    }

    pivot.generalFeatures.irrig_cap.depth_app = I;
    await pivot.save()

    return I;
}
exports.depth_app = depth_app;

const maximum_water_speed = async (pivot) => {

    let flow = pivot.generalFeatures.irrig_cap.flow.find(it=>it.default == true)
    flow = flow.value;

    let major = -1;
    let span = -1;

    const diameters_values = {
        '8"5/8':0.213075,
        '6"5/8':0.162275,
        '5"':0.121
    }

    const diameters = await Diameter.find();

    let total_length = pivot.spans.length;

    const lengths = await LengthSpan.find().populate({path:'length'});
    const endgun_radius = pivot.generalFeatures.endgun1_radius || 0
    asyncForEach(pivot.spans.spans, (item) =>{
        const d = diameters.find(it=>it._id+'' == item.span_diameter+'')
        const val = diameters_values[d.diameter]
        const speed = (flow / 1000) / (Math.PI * Math.pow(val,2)/4);
        if(speed>major){
            major = speed;
            span = item.span_position;
        }
        let span_length = lengths.find(it=>it.length._id+'' == item.length+'')
        span_length = span_length.length.length.split('m')[0];
        flow = flow * (1 - Math.pow((span_length/ (total_length + endgun_radius)),2))
        total_length -=span_length
    })
  
    pivot.generalFeatures.irrig_cap.max_wspeed = major;
    pivot.generalFeatures.irrig_cap.max_wspeed_pos = span;

    await pivot.save();
    return {
        max_wspeed:major,
        max_wspeed_pos:span
    }
}
exports.maximum_water_speed = maximum_water_speed;


exports.irrigation_calculate = async (id) =>{
    let pivot = await ObjectMachine.findById(id)
    .populate({path:'spans.overhang.oh_length'})

    await maximum_speed(pivot);
    await time_lap(pivot);
    await depth_app(pivot);
    await maximum_water_speed(pivot);

    pivot = await ObjectMachine.findById(id)
    return pivot;
}