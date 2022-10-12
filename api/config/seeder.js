
const asyncForEach = require('../utils/asyncForEach')
const db = require('../config/database')
const base_data_uri = './datas/'
const bcrypt = require('bcryptjs')
const User = require('../components/models/User');

const seed = async (tabla,values, prop = null)=>{
    try{
        console.log(`Seeding ${tabla.collection.collectionName}`)
        await tabla.deleteMany();
        // await tabla.insertMany(values)
        await asyncForEach(values,async (item)=>{
            item.password = await bcrypt.hash(item.password, 10)
            if(prop){
                await tabla.findOneAndUpdate( { [prop]:item[prop] }, item, { upsert: true });
            }else
                await tabla.findOneAndUpdate( item, item, { upsert: true });
        })
        return true;
    }catch(error){
        console.log('error',error);
        return false;
    }
}

const loadDatas = (name)=>{
    return require(`${base_data_uri}${name}`)
}

const seeders =[
    {tabla:User,values:loadDatas('users')},
]

// run all seeders
exports.init = async()=>{
    let status = true; 

    await asyncForEach(seeders,async(item)=>{
        let st = await seed(item.tabla,item.values, item.prop?item.prop:null)
        if(!st) status =false
    })


    return status;
}
