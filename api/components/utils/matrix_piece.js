const asyncForEach = require("../../../utils/asyncForEach");
const Matrix = require("../models/Matrix");
const {point_first_span, point_last_span} = require('./conditional_functions')

const mainPop = async (filter)=>{
    const datas =  await Matrix.find(filter)
    .populate("reference_part")
    .populate("category")
    .populate({path:'general',populate: { path: 'tradername' }})
    .populate({path:'general',populate: { path: 'model' }})
    .populate({path:'general',populate: { path: 'endgctrl_1' }})
    .populate({path:'general',populate: { path: 'endgctrl_2' }})
    .populate({path:'general',populate: { path: 'endgun1' }})
    .populate({path:'general',populate: { path: 'endgun2' }})
    .populate({path:'general',populate: { path: 'booster_pump' }})
    .populate({path:'properties',populate: { path: 'span_diameter' }})
    .populate({path:'properties',populate: { path: 'pipeSpacing' }})
    .populate({path:'properties',populate: { path: 'length' }})
    .populate({path:'properties',populate: { path: 'span_protection' }})
    .populate({path:'properties',populate: { path: 'electric_cable' }})
    .populate({path:'properties',populate: { path: 'oh_diameter' }})
    .populate({path:'properties',populate: { path: 'oh_pipe_spacing' }})
    .populate({path:'properties',populate: { path: 'oh_protection' }})
    .populate({path:'properties',populate: { path: 'oh_length' }})
    .populate({path:'properties',populate: { path: 'towable_type' }})
    .populate({path:'properties',populate: { path: 'profile' }})
    .populate({path:'properties',populate: { path: 'protection' }})
    .populate({path:'properties',populate: { path: 'diameter' }})
    .populate({path:'properties',populate: { path: 'elcables_cond' }})
    .populate({path:'properties',populate: { path: 'type_panel' }})
    .populate({path:'properties',populate: { path: 'type_com' }})
    .populate({path:'properties',populate: { path: 'wgatew_power' }})
    .populate({path:'properties',populate: { path: 'wgatew_frec' }});

    return datas;
}

exports.matrixMatch= async (configuration, objeto) => {

    let qry = []
    // let qry = [{
    //     $match:{
    //         'general.tradername': {$in:[configuration.general.tradername?configuration.general.tradername:[],[]]},
    //         'general.model': {$in:[configuration.general.model?configuration.general.model:[],[]]},
    //         'general.endgctrl_1': {$in:[configuration.general.endgctrl_1?configuration.general.endgctrl_1:[],[]]},
    //         'general.endgctrl_2': {$in:[configuration.general.endgctrl_2?configuration.general.endgctrl_2:[],[]]},
    //         'general.endgun1': {$in:[configuration.general.endgun1?configuration.general.endgun1:[],[]]},
    //         'general.endgun2': {$in:[configuration.general.endgun2?configuration.general.endgun2:[],[]]},
    //         'general.std_runlight': {$in:[configuration.general.std_runlight?configuration.general.std_runlight:null,null]},
    //         'general.strobe_runlight': {$in:[configuration.general.strobe_runlight?configuration.general.strobe_runlight:null,null]},
    //         'general.alarm_light': {$in:[configuration.general.alarm_light?configuration.general.alarm_light:null,null]},
    //         'general.barricade': {$in:[configuration.general.barricade?configuration.general.barricade:null,null]},
    //         'general.drenpipe_ohang': {$in:[configuration.general.drenpipe_ohang?configuration.general.drenpipe_ohang:null,null]},
    //         'general.endof_fstop': {$in:[configuration.general.endof_fstop?configuration.general.endof_fstop:null,null]},
    //         'general.endof_ftower': {$in:[configuration.general.endof_ftower?configuration.general.endof_ftower:null,null]},
    //     }
    // }]

    // if(configuration.category == 'span') {
        qry.push({
            $match:{
                // 'properties.span.span_diameter': configuration.span.span_diameter,
                'general.tradername': {$in:[configuration.general.tradername]},
                // 'properties.span.span_diameter':{
                //     $in:[
                //         configuration.span.span_diameter]
                //     },
                // 'properties.span.pipe_spacing':{
                //     $in:[
                //         configuration.span.pipe_spacing?configuration.span.pipe_spacing:[],
                //         null
                //     ]
                // },
                // 'properties.span.span_protection':{
                //     $in:[
                //         configuration.span.span_protection?configuration.span.span_protection:[],
                //         null
                //     ]
                // },
                // 'properties.span.length':{$in:[configuration.span.length?configuration.span.length:[],null]},
                // 'properties.span.wire_size':{$in:[configuration.span.wire_size?configuration.span.wire_size:[],null]},
                // 'properties.span.cable_protection':{$in:[configuration.span.cable_protection?configuration.span.cable_protection:[],null]},
            }
        })
            
    }

    console.log(qry);
   let datas = await Matrix.aggregate(qry);
   return datas;
}