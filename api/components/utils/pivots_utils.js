
const Units = require('../models/Units')
const ObjectMachine = require('../models/ObjectMachine')
const Length = require('../models/Length')
const LengthPS = require('../models/LengthPS')

const asyncForEach = require('../../../utils/asyncForEach')
const { change_unit, app_calc, flow_calc, itr_calculate, percent_calculate, changeMeasurePivot }  = require('./units_measure')

const calculate_irc = async (pivot, app, flow, itr, type, valueSet) =>{
   
     pivot = await ObjectMachine.findById(pivot._id);

    const app_units = await Units.find({
        filters:"app",
        // type
    });

    let app_list = [];
    if(app.um == 'inch/xh' || app.um == 'mm/xh'){
        app_list.push({
            value:app.value,
            um:app.um,
            default:true
        })
        app.um = app.um == 'inch/xh' ? 'inch/24h' : 'mm/24h';
        app.value = app.value/itr.percent;
        app_list.push(app)
    }else{
        app_list.push({
            ...app,
            default:true
        })
        if(app.um == 'mm/24h' || app.um == 'inch/24h'){
            app_list.push({
                // um:itr.um,
                um:app.um == 'mm/24h'?'mm/xh':'inch/xh',
                value:app.value*itr.percent
            })
            const v = await change_unit(app.value, app.um,  (app.um == 'mm/24h') ? 'inch/24h' : 'mm/24h', false);
            app_list.push({
                // um:itr.um,
                um:app.um == 'mm/24h'?'inch/xh':'mm/xh',
                value:v.value*itr.percent
            })
        }
        else{
            const v = await change_unit(app.value, app.um,  (type == 'metric') ? 'mm/24h' : 'inch/24h', false);
            app_list.push({
                um: (type == 'metric') ? 'mm/xh' : 'inch/xh',
                // um: itr.um,
                value: v.value*itr.percent
            })
        }
    }

    
    await asyncForEach(app_units, async (item)=>{
        if(item.name!=app.um){
            let val = await change_unit(app.value, app.um, item.name, false)
            if(val.status)
                app_list.push({
                    value:val.value,
                    um:item.name
                })
        }
    })

    pivot.generalFeatures.irrig_cap.app = app_list;
    
    pivot.generalFeatures.irrig_timrate = {
        hday: itr.hdays,
        daysweek: itr.daysw,
        percent: itr.percent,
        um: itr.um,
        valueSet
    };


    const flow_units = await Units.find({
        filters:"flow",
        // type
    });

    let flow_list = [];
    flow_list.push({
        ...flow,
        default:true
    })

    
    await asyncForEach(flow_units, async (item)=>{
        if(item.name!=flow.um){
            let val = await change_unit(flow.value, flow.um, item.name, false)
            if(val.status)
                flow_list.push({
                    value:val.value,
                    um:item.name
                })
        }
    })

    pivot.generalFeatures.irrig_cap.flow = flow_list;

    await pivot.save();

    return pivot;

}

exports.calculate_irc = calculate_irc

exports.iriigation_all = async (pivot, eia, flow, app, itr) => {
    let um_f;
    let um_app;
    if(flow.value) {
        pivot.generalFeatures.irrig_cap.valueSet = 'flow';
        pivot.save();
        um_f = await Units.findOne({
            name:flow.um
        });
        if(!um_f)
            return next(new ErrorHandler('Incorrect um',404)) 
        um_app = await Units.findOne({
            filters:'app',
            default:true,
            type:um_f.type
        });
        app = {
            value:await app_calc(flow,um_app, eia),
            um: um_app.name
        }

    } else if(app.value) {
        pivot.generalFeatures.irrig_cap.valueSet = 'app';
        pivot.save();
        um_app = await Units.findOne({
            name:app.um
        });
        um_f = await Units.findOne({
            filters:'flow',
            default:true,
            type:um_app.type
        });
        flow = {
            value: await flow_calc(app,um_f, eia, itr),
            um: um_f.name
        }

    }else{
        return next(new ErrorHandler('Invalid data, must set flow or app values',404)) 
    }

    let valueSet;
    if(!itr.percent){
        valueSet = 'days';
        const v =  await percent_calculate(itr.hdays, itr.daysw, app, um_app.type)
        itr.percent = v.itr
        itr.value = v.value
    }else{
        valueSet = 'percent';
        itr.daysw = 7;
        const v = await itr_calculate(itr.percent, app, um_app.type)
        itr.hdays = v.hdays;
        itr.value = v.value
    }

    const umxh = await Units.findOne({
        name:um_app.type=='metric'?'mm/xh':'inch/xh'
    });

    const um_itr = Math.round((itr.hdays*itr.daysw/168)*24)
    itr.um = umxh.description.replace('%x',um_itr);
    
    pivot = await calculate_irc(pivot, app, flow, itr, um_app.type, valueSet)
    return pivot;
}

exports.calculate_length_and_area = async (pivot) =>{

    // pivot radius
    let lengths = await Length.find();
    let suma = pivot.spans.spans.reduce( (sum,it)=>{
        let l = lengths.find(item=>item._id+'' == it.length+'')
        if(l){
            l = l.length.slice(0,-1);
            l = parseFloat(l);
        }
        else
            l =0;
        return sum+=l
    },0); 
    let oh = 0;
    if(pivot.spans.overhang.oh_length){
        const ohl = await LengthPS.findById(pivot.spans.overhang.oh_length);
        if(ohl){
            let n = ohl.length;
            n = n.slice(0,-1);
            n = parseFloat(n);
            oh=n;
        }
    }
    let total = suma + oh
    pivot.spans.length = total
   
    total = total || pivot.generalFeatures.target_radius
    
    // area irrigation calc
    if(!pivot.generalFeatures.irrig_area)
        pivot.generalFeatures.irrig_area = {}

    if(!pivot.generalFeatures.spia)
        pivot.generalFeatures.spia = 360

    pivot.generalFeatures.span_area.value = ( ( Math.PI * Math.pow(total,2) * pivot.generalFeatures.spia ) / 360) / 10000
    pivot.generalFeatures.span_area.um = 'ha'
    
    if(pivot.generalFeatures.endgia_1!=0){
        let ar = ( ( Math.PI * Math.pow(pivot.generalFeatures.endgun1_radius,2) * pivot.generalFeatures.endgia_1 ) / 360) / 10000;
        if(pivot.generalFeatures.endgia_2!=0)
            ar += ( ( Math.PI * Math.pow(pivot.generalFeatures.endgun2_radius,2) * pivot.generalFeatures.endgia_2 ) / 360) / 10000;
        
        pivot.generalFeatures.endgun_area.value = ar;
        pivot.generalFeatures.endgun_area.um = 'ha';
    }

    pivot.generalFeatures.irrig_area.value = pivot.generalFeatures.span_area.value +  pivot.generalFeatures.endgun_area.value;
    pivot.generalFeatures.irrig_area.um = 'ha'

    
    let area = 0;
    if(pivot.pivotPoint && pivot.pivotPoint.towable){
        if(pivot.pivotPoint.simultaneus_irrig){
            area = pivot.pivotPoint.points.reduce( (sum,it)=>{
                return sum+= ((Math.PI * Math.pow(total,2) * it.angle)/360 ) / 10000
            },0)
        }else{
            let max = pivot.generalFeatures.spia;
            if(pivot.pivotPoint.points.length>0){
                max = pivot.pivotPoint.points[0].angle;
                for(let i=1;i<pivot.pivotPoint.points.length;i++)
                    if(pivot.pivotPoint.points[i].angle>max){
                        max = pivot.pivotPoint.points[i].angle
                    }
            }
            area = ((Math.PI * Math.pow(total,2)*max)/360 ) / 10000
        }
    }else{
        area = pivot.generalFeatures.irrig_area.value
    }
    
    let endgarfull=0
    if(pivot.generalFeatures.endgia_1!=0){
        endgarfull = ( ( Math.PI * Math.pow(pivot.generalFeatures.endgun1_radius,2) )) / 10000;
        if(pivot.generalFeatures.endgia_2!=0)
            endgarfull += ( ( Math.PI * Math.pow(pivot.generalFeatures.endgun2_radius,2) )) / 10000;
    }
    
    pivot.generalFeatures.irrig_eqvarea.value = area + endgarfull
    pivot.generalFeatures.irrig_eqvarea.um = 'ha'

    await pivot.save();

    if(pivot.generalFeatures.irrig_cap.flow[0]){
        let app = pivot.generalFeatures.irrig_cap.app.find(it=>it.default == true);
        let flow = pivot.generalFeatures.irrig_cap.flow.find(it=>it.default == true);
        const um_f = await Units.findOne({
            name:flow.um
        });

        if(pivot.generalFeatures.irrig_cap.valueSet == 'app'){
            flow = {
                value: "",
                um:""
            }
        }else{
            app = {
                value: "",
                um:""
            }
        }
    
        await this.iriigation_all(pivot,pivot.generalFeatures.irrig_eqvarea, flow, app,pivot.generalFeatures.irrig_timrate)
    }

    await pivot.save();

    return pivot;

}