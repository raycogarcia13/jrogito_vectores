const asyncForEach = require('./asyncForEach');
const db = require('../config/database')
const base_data_uri = '../config/datas/'
const seed = async (tabla,values)=>{
    try{
        await tabla.bulkCreate(values)
        return true;
    }catch(error){
        console.log('error',error);
        return false;
    }
}

const setPermissions = async ()=>{
    try{
        const User = db.models.User;
        const datas = require('../config/datas/users_permission')
        await asyncForEach(datas,async (item)=>{
            const it = await db.models.User.findByPk(item.id)
            await it.setPermissions(item.permissions)
        })
        return true;
    }catch(error){
        console.log('error',error);
        return false;
    }
}
const setDealers = async ()=>{
    try{
        const User = db.models.User;
        const datas = require('../config/datas/users_dealer')
        await asyncForEach(datas,async (item)=>{
            const it = await db.models.User.findByPk(item.id)
            await it.setDealers(item.dealer)
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

// seeders activos
const seeders =[
    // {tabla:db.models.Country,values:loadDatas('country')},
    {tabla:db.models.Region,values:loadDatas('region')},
    {tabla:db.models.Rol,values:loadDatas('rols')},
    {tabla:db.models.Permission,values:loadDatas('permission')},
    {tabla:db.models.Dealer,values:loadDatas('dealer')},
    {tabla:db.models.User,values:loadDatas('users')},
]

const manysToManys = [
    setPermissions,
    setDealers,
]

// run all seeders
exports.init = async()=>{
    let status = true; 
    // await asyncForEach(seeders,async(item)=>{
    //         let st = await seed(item.tabla,item.values)
    //         if(!st) status =false
    // })
    
    // await asyncForEach(manysToManys,async(item)=>{
    //         let st = await item()
    //         if(!st) status =false
    // })

    const data = [
        {
            name: "new_claims_enotif",
        },
        {
            name: "rejected_claims_enotif",
        },
        {
            name: "close_claims_enotif",
        },
        {
            name: "approve_claims_enotif",
        },
        {
            name: "assing_responsible",
        },
        {
            name: "view_claims_always",
        }
    ]

    console.log('loll');

    let st = await seed(db.models.Permission,data)
    if(!st) status =false

    return status;
}
