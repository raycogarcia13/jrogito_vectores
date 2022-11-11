const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors")
const bcrypt = require('bcryptjs')

const Epidemia = require('../models/Epidemia')
const Sintomas = require('../models/Sintomas');
const TipoEpidemia = require("../models/TipoEpidemia");
const { Types } = require("mongoose");

const poblacion = {
    "Hospital":83674,
    "Policlínico 1":128383,
    "Policlínico 2": 234226,
    "Policlínico 3": 20870
}

const centros = [
    "Hospital",
    "Policlínico 1",
    "Policlínico 2",
    "Policlínico 3",
]

//get  =>[Get]/api/v1/matrix_reference
exports.febriles = catchAsyncErrors(async (req,res,next) =>{

    const fiebre = await Sintomas.findOne({
        name:"Fiebre"
    })

    const fecha = (new Date().getMonth()+1)+'/1/'+new Date().getFullYear();

    const today = new Date((new Date().getMonth()+1)+'/'+(new Date().getDate())+'/'+new Date().getFullYear());
    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate()+1);

    const all_month = await Epidemia.find({
        sintomas:fiebre._id,
        fecha_primera:{
            $gte:new Date(fecha)
        }
    })
    const igm_month = await Epidemia.find({
        fecha_suma:{
            $gte:new Date(fecha)
        }
    });
    
    let all_febriles = [];
    for(const centro of centros){
        let index = all_febriles.findIndex(it=>it.centro == centro);
        if(index == -1){
            all_febriles.push({
                centro,
                fiebre_day:0,
                fiebre_month:0,
                igm_day:0,
                igm_month:0,
                igm_positivo_dia:0,
                igm_positivo_month:0
            })
        }
    }
    all_febriles.push({
        centro:'Municipio',
        fiebre_day:0,
        fiebre_month:0,
        igm_day:0,
        igm_month:0,
        igm_positivo_dia:0,
        igm_positivo_month:0
    })

    const index_municipio = all_febriles.length-1;

    for(const item of all_month){
        const index_centro = all_febriles.findIndex(it=>it.centro == item.centro);
        all_febriles[index_centro].fiebre_month++;
        all_febriles[index_municipio].fiebre_month++;
        if(item.fecha_primera>=today && item.fecha_primera<=tomorrow){
            all_febriles[index_centro].fiebre_day++;
            all_febriles[index_municipio].fiebre_day++;

        }
    }

    for(const item of igm_month){
        const index_centro = all_febriles.findIndex(it=>it.centro == item.centro);
        all_febriles[index_centro].igm_month++;
        all_febriles[index_municipio].igm_month++;
        if(item.resultado == 'POSITIVO'){
            all_febriles[index_centro].igm_positivo_month++;
            all_febriles[index_municipio].igm_positivo_month++;
        }
        if(item.fecha_suma>=today && item.fecha_suma<=tomorrow){
            all_febriles[index_centro].igm_positivo_day++;
            all_febriles[index_municipio].igm_positivo_day++;

        }
    }


    return res.json({
        status:"success",
        today,
        tomorrow,
        data:all_febriles
    })
})

//get  =>[Get]/api/v1/matrix_reference
exports.por_enfermedades = catchAsyncErrors(async (req,res,next) =>{

    const enfermedades = await TipoEpidemia.find()

    const fecha = (new Date().getMonth()+1)+'/1/'+new Date().getFullYear();

    const today = new Date((new Date().getMonth()+1)+'/'+(new Date().getDate())+'/'+new Date().getFullYear());
    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate()+1);

    const all_month = await Epidemia.find({
        fecha_primera:{
            $gte:new Date(fecha)
        }
    }).populate('tipo')
    
    let all = [];
  
    for(const centro of centros){
        let index = all.findIndex(it=>it.centro == centro);
        if(index == -1){
            all.push({
                centro,
                total:0,
            })
        }
    }
    all.push({
        centro:'Municipio',
        total:0
    })

    const index_total = all.length-1;
    for(const enf of enfermedades){
        for(let it of all){
            it[`${enf.tipo}`] = {
                dia:0,
                mes:0,
                positivos_total:0,
                positivos_dia:0
            }
        }
    }

    for(const item of all_month){
        const centro = all.find(it=>it.centro == item.centro);
        all[index_total].total++;
        if(centro){
            centro.total ++;
            centro[item.tipo.tipo].mes++;
            all[index_total][item.tipo.tipo].mes++;
            if(item.fecha_primera>=today && item.fecha_primera<=tomorrow){
                centro[item.tipo.tipo].dia++;
                all[index_total][item.tipo.tipo].dia++;
                if(item.resultado=='POSITIVO'){
                    centro[item.tipo.tipo].positivos_dia++;
                    all[index_total][item.tipo.tipo].positivos_dia++;
                }
            }
            if(item.resultado=='POSITIVO'){
                centro[item.tipo.tipo].positivos_total++;
                all[index_total][item.tipo.tipo].positivos_total++;
            }
        }
    }
   


    return res.json({
        status:"success",
        today,
        tomorrow,
        data:all
    })
})

exports.groupingMonth = catchAsyncErrors(async (req,res,next) =>{
    let data = await Epidemia.aggregate([{ 
        $match: { resultado: "POSITIVO" } 
    },{
        $project:
          {
            _id: 0,
            month: { $month: "$fecha_primera" },
            enfermedad:"$tipo",
            cant:{$sum:1}
        }
    },{
        $group:{
            _id:"$month",
            cant:{$sum:"$cant"}
        }
    }])

    for(let i=1;i<=12;i++){
        const item = data.find(it=>it._id==i);
        if(!item){
            data.push({
                _id:i,
                cant:0
            })
        }
    }

    data.sort((a,b)=>{
        if(a._id>b._id)
            return 1
        else if(a._id<b._id)
            return -1
        return 0;
    })


    return res.json({
        status:"success",
        data
    })
})

exports.groupingEnfermedad = catchAsyncErrors(async (req,res,next) =>{
    
    const tipos = await TipoEpidemia.find();

    let data = await Epidemia.aggregate([{ 
        $match: { resultado: "POSITIVO" } 
    },{
        $project:
          {
            _id: 0,
            enfermedad:"$tipo",
            cant:{$sum:1}
        }
    },{
        $group:{
            _id:"$enfermedad",
            cant:{$sum:"$cant"}
        }
    }])


    data = data.map(it=>{
        it.enfermedad = tipos.find(i=>i._id+""==it._id+"").tipo;
        return it
    })


    return res.json({
        status:"success",
        data
    })
})

exports.tasa = catchAsyncErrors(async (req,res,next) =>{
    const { id } = req.params;

    const fecha = (new Date().getMonth()+1)+'/1/'+new Date().getFullYear();


    let data = await Epidemia.find({
        tipo:id,
        fecha_primera:{
            $gte:new Date(fecha)
        },
        resultado:"POSITIVO"
    })

    let all = [];

    for(const centro of centros){
        all.push({
            centro,
            poblacion:poblacion[centro],
            activos:0,
            tasa:0
        })
    };

    for(const it of data){
        const item = all.find(i=>i.centro == it.centro);
        if(item){
            item.activos++;
        }
    }

    for(let item of all){
        item.tasa = (item.activos/item.poblacion)*10000
    }

    return res.json({
        status:"success",
        data:all
    })
})

