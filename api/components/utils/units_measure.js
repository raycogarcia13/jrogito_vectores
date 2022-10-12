
const asyncForEach = require('../../../utils/asyncForEach');
const Units = require('../models/Units')
const Version = require('../models/Version')

const calculate = (value, unit, inverso = false) => {

    if(inverso)
        unit.oper = unit.oper=='*'?"/":"*";

    if(unit.oper == '*'){
        return value * unit.factor
    }else {
        return value / unit.factor;
    }
}


const change_unit = async (value, from, to, change = false) =>{

    let unidad = await Units.findOne({
        name:from
    });
    if(!unidad)
        return {
            status: false,
            msg: "not exist unit from"
        }

    let second
    let conversion = value;
    let converted = false;
    let path = true;

    do{
        if(unidad.conversion.find(it=>it.unit == to)){
            conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == to));
            converted = true;
        }else{
            if(change){
                if(unidad.equivalent){
                    second= await Units.findOne({
                        name:unidad.equivalent
                    });
                    change = false;
    
                    if(unidad.conversion.find(it=>it.unit == unidad.equivalent)){
                        conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == unidad.equivalent));
                    }else{
                        conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name), true);
                    }
                    unidad = second;
                }else{
                    if(unidad.parent){
                        second= await Units.findOne({
                            name:unidad.parent
                        });
        
                        if(unidad.conversion.find(it=>it.unit == unidad.parent)){
                            conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == unidad.parent));
                        }else{
                            conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name), true);
                        }
                        unidad = second;
                    }else{
                        path = false;
                    }
                }
            }
            else{
                if(unidad.parent){
                    second= await Units.findOne({
                        name:unidad.parent
                    });
    
                    if(unidad.conversion.find(it=>it.unit == unidad.parent)){
                        conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == unidad.parent));
                    }else{
                        conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name),true);
                    }
                    unidad = second;
                }else{
                    path = false;
                }
            }
        }

    }while(path && !converted)

    path = true

    if(!converted)
    {
        unidad = await Units.findOne({
            name:to
        });
        if(!unidad)
            return {
                status: false,
                msg: "not exist unit to"
            }

        do{
            if(unidad.conversion.find(it=>it.unit == from)){
                conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == from),true);
                converted = true;
    
            }else{

                if(change){
                    if(unidad.equivalent){
                        second= await Units.findOne({
                            name:unidad.equivalent
                        });
                        change = false;
        
                        if(unidad.conversion.find(it=>it.unit == unidad.equivalent)){
                            conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == unidad.equivalent),true);
                        }else{
                            conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name));
                        }
                        unidad = second;
                    }else{
                        if(unidad.parent){
                            second= await Units.findOne({
                                name:unidad.parent
                            });
            
                            if(unidad.conversion.find(it=>it.unit == unidad.parent)){
                                conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == unidad.parent),true);
                            }else{
                                conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name));
                            }
                            unidad = second;
                        }else{
                            path = false;
                        }
                    }
                }else{
                    if(unidad.parent){
                        second= await Units.findOne({
                            name:unidad.parent
                        });
                        if(unidad.conversion.find(it=>it.unit == second.name)){
                            conversion = calculate(conversion,unidad.conversion.find(it=>it.unit == second.name),true);
                        }else{
                            conversion = calculate(conversion,second.conversion.find(it=>it.unit == unidad.name));
                        }
                        unidad = second;
                    }else{
                        path = false;
                    }
                }
            }
        }while( path && !converted )
    
    }

    if(converted){
        return {
            status:true,
            value: conversion
        }
    }else{
        return {
            status: false,
            msg: "not exist conversion"
        }
    }
    
}

exports.change_unit = change_unit;

exports.flow_calc = async (app_r, um, eia, itr) =>{
    
    let app = {
        value:app_r.value,
        um:app_r.um
    };

    const calcitr = itr.percent ? itr.percent : (itr.hdays* itr.daysw)/168; 
    if(app.um == 'mm/xh'){
        app.um = 'mm/24h';
        app.value = app.value / calcitr; 
    }else if(app.um == 'inch/xh'){
        app.um = 'inch/24h';
        app.value = app.value / calcitr; 
    }

    const def_um = await Units.findOne({
        type: um.type,
        filters:'app',
        default:true
    });

    if(def_um.name != app.um){
        let v = await change_unit(app.value, app.um, def_um.name, false);
        app.value = v.value 
        app.um = def_um.name
        console.log(`to default (${def_um.name}) =>`, app.value)
    }
    
    console.log(`value  =>`, app.um,' => ',app.value)
    
    if(app.um!='l/s/ha'){
        let v = await change_unit(app.value, app.um, 'l/s/ha', true);
        app.value = v.value 
        app.um = 'l/s/ha'
        console.log(`to (l/s/ha) =>`, app.value)
    }
    
    app.value = app.value*eia.value
    app.um = 'l/s'
    console.log(`to (l/s) =>`, app.value)
    
    if(app.um!=um.name){
        let v = await change_unit(app.value, app.um, um.name, true);
        app.um = um.name
        app.value = v.value
        console.log(`to default (${um.name}) =>`, app.value)
    }

    return app.value;
}

exports.app_calc = async (flow_r, um, eia) =>{
    
    const flow = {
        um:flow_r.um,
        value: flow_r.value
    }
    const def_um = await Units.findOne({
        type: um.type,
        filters:'flow',
        default:true
    });

    if(def_um.name != flow.um){

        let v = await change_unit(flow.value, flow.um, def_um.name, false);
        flow.value = v.value 
        flow.um = def_um.name
    }
    
    if( flow.um != 'l/s' ) {
        let v = await change_unit(flow.value, flow.um, 'l/s', true);
        flow.value = v.value    
        flow.um = 'l/s'    
    }

    let value = flow.value/eia.value; 
    flow.um = 'l/s/ha'

    if( flow.um!=um.name){
        let v = await change_unit(value, flow.um, um.name, true);
        console.log(v)
        flow.um = um.name;
        value = v.value;    
    }
    
    return value;

}

exports.percent_calculate = async (hdays, daysw, app_r, type)=>{
    let um24h;
    
    let app = {
        value:app_r.value,
        um:app_r.um
    };

    const calcitr = (hdays*daysw)/168; 
    if(app.um == 'mm/xh'){
        app.um = 'mm/24h';
        app.value = app.value / calcitr; 
        um24h = app;
    }else if(app.um == 'inch/xh'){
        app.um = 'inch/24h';
        app.value = app.value / calcitr; 
        um24h = app;
    }else{
        if(type == 'metric')
            um24h = await change_unit(app.value,app.um,'mm/24h',false);
        else{
            um24h = app;
        }
    }

    const itr =  hdays * daysw / 168;

    return {
        itr,
        value:itr*um24h.value
    }


}

exports.itr_calculate = async (percent, app, type)=>{
    let um24h;
    if(type == 'metric')
        um24h = await change_unit(app.value,app.um,'mm/24h',false);
    else{
        um24h = app.value;
    }

    const hdays = percent*168/7

    return {
        hdays,
        value: percent*um24h.value
    }
}

const changeEquivalentUnit = async (um , val, type)=>{

    let unit = await Units.findOne({
        name:um
    })

    if(!unit)
        return false;


    let value;
    let destiny;
    if(unit.equivalent){
        value = await change_unit(val,um,unit.equivalent,true);
        value = value.value
        destiny = unit.equivalent
    }
    else{
        const unit_def = await Units.findOne({
            type:unit.type=='metric'?'imperial':metric,
            default:true,
            filters:type
        })
        value = await change_unit(val,um,unit_def.name,true);
        destiny = unit_def.name
    }
    
    return {
        status:true,
        value,
        um: destiny
    };
}

exports.changeEquivalentUnit = changeEquivalentUnit;

exports.changeMeasurePivot = async (pivot, system)=>{

    let version = await Version.findOne({
        pivots:pivot._id
    })

    if(version.u_measure!=system){
        version.u_measure = system

        // irrigation
        if(pivot.generalFeatures.irrig_cap.length >0 ){
            const def_app = pivot.generalFeatures.irrig_cap.app.find(it=>it.deafult = true)
            const def_flow = pivot.generalFeatures.irrig_cap.flow.find(it=>it.deafult = true);
            
            let irr_app = await changeEquivalentUnit(def_app.um,1,'app')
            irr_app =irr_app.um;
    
            pivot.generalFeatures.irrig_cap.app = pivot.generalFeatures.irrig_cap.app.map(it=>{
                if(it.um == def_app.um)
                    it.default = false;
                if(it.um == irr_app)
                    it.default = true;
                
                    return it
            })
        }
        if(pivot.generalFeatures.irr_flow && pivot.generalFeatures.irr_flow.length > 0 ){
            let irr_flow = await changeEquivalentUnit(def_flow.um,1,'flow')
            irr_flow =irr_flow.um;
            pivot.generalFeatures.irrig_cap.flow = pivot.generalFeatures.irrig_cap.flow.map(it=>{
                if(it.um == def_flow.um)
                    it.default = false;
                if(it.um == irr_flow)
                    it.default = true;
                
                    return it
            })
        }

        await version.save();
    }
    await pivot.save();
    return pivot;
}