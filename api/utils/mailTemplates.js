const register = require('./mailTemplates/register')
const register_complete = require('./mailTemplates/register_complete')
const forget = require('./mailTemplates/forget')
const new_report = require('./mailTemplates/new_report')
const report_approved = require('./mailTemplates/report_approved')
const report_approved_01 = require('./mailTemplates/report_approved_01')
const report_complete = require('./mailTemplates/report_complete')
const report_complete_01 = require('./mailTemplates/report_complete_01')
const report_rejected = require('./mailTemplates/report_rejected')
const report_rejected_01 = require('./mailTemplates/report_rejected_01')
const notification = require('./mailTemplates/notification')
const new_task = require('./mailTemplates/new_task')
const task_solution = require('./mailTemplates/task_solution')
const assignment_responsible = require('./mailTemplates/assignment_responsible')

const varsLink = (name)=>{
    let value;

    switch(name){
        case 'VERIFY':{
            value = process.env.NODE_ENV=='DEVELOPMENT'?process.env.FRONTEND_DEV_VERIFY:process.env.FRONTEND_VERIFY
            break;
        }
        case 'FORGET':{
            value = process.env.NODE_ENV=='DEVELOPMENT'?process.env.FRONTEND_DEV_FORGET:process.env.FRONTEND_FORGET
            break;
        }
        case 'WARRANTY':{
            value = process.env.NODE_ENV=='DEVELOPMENT'?process.env.FRONTEND_DEV_WARRANTY:process.env.FRONTEND_WARRANTY
            break;
        }
    }

    return value;
}

const fillTemplate = (data,template) =>{
    let T = {};
    switch(template){
        case 'register':{
            T.subject = register.en.subject;  
            T.messageT = register.en.messageT.replace('%link',varsLink('VERIFY')+'?tkn='+data.tkn);  
            let textH = register.en.messageH.replace('%link',varsLink('VERIFY')+'?tkn='+data.tkn)
            textH = textH.replaceAll('%username',data.user)
            textH = textH.replace('%email',data.email)
            textH = textH.replace('%fullname',data.name);
            T.messageH = textH;  
            break;
        }
        case 'register_complete':{
            T.subject = register_complete.en.subject;  
            T.messageT = register_complete.en.messageT;  
            let textH = register_complete.en.messageH;
            textH = textH.replaceAll('%username',data.user)
            textH = textH.replace('%email',data.email)
            textH = textH.replace('%fullname',data.name);
            T.messageH = textH;
            break;  
        }
        case 'forget':{
            T.subject = forget.en.subject;  
            T.messageT = forget.en.messageT.replace('%link',varsLink('FORGET')+'?tkn='+data.tkn);  
            let textH = forget.en.messageH.replace('%link',varsLink('FORGET')+'?tkn='+data.tkn)
            textH = textH.replaceAll('%username',data.user)
            textH = textH.replace('%email',data.email)
            textH = textH.replace('%fullname',data.name);
            T.messageH = textH;
            break;  
        }
        case 'new_report':{
            T.subject = new_report.en.subject;  
            T.messageT = new_report.en.messageT.replace('%code',data.code);  
            let textH = new_report.en.messageH.replace('%code',data.code)

            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replace('%dealer',data.dealer.fullname)
            textH = textH.replace('%country',data.country);
            textH = textH.replace('%problem_date',data.problem_date);
            textH = textH.replace('%report_date',data.report_date);
            textH = textH.replace('%report_date',data.report_date);
            textH = textH.replace('%aisco_sales_order',data.aisco_sales_order);
            textH = textH.replace('%machine_serial_number',data.machine_serial_number);
            textH = textH.replace('%problem_description',description);
            textH = textH.replace('%invoice',data.invoice);
            textH = textH.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            T.messageH = textH;
            break;  
        }
        case 'assignment_responsible':{
            T.subject = assignment_responsible.en.subject;  
            T.messageT = assignment_responsible.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code);  
            let textH = assignment_responsible.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%responsible',data.responsible)
            textH = textH.replaceAll('%assigner',data.assigner)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replace('%dealer',data.dealer)
            textH = textH.replace('%country',data.country);
            textH = textH.replace('%problem_date',data.problem_date);
            textH = textH.replace('%report_date',data.report_date);
            textH = textH.replace('%aisco_sales_order',data.aisco_sales_order);
            textH = textH.replace('%machine_serial_number',data.machine_serial_number);
            textH = textH.replace('%problem_description',description);
            textH = textH.replace('%invoice',data.invoice);
            textH = textH.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            T.messageH = textH;
            break;  
        }
        case 'approved_report':{
            T.subject = report_approved.en.subject;  
            T.messageT = report_approved.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_approved.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            textH = textH.replaceAll('%name',data.name)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'report_approved_01':{
            T.subject = report_approved_01.en.subject;  
            T.messageT = report_approved_01.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_approved_01.en.messageH.replace('%code',data.code)
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%warranty_type',data.warranty_type)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'report_complete':{
            T.subject = report_complete.en.subject;  
            T.messageT = report_complete.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_complete.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            textH = textH.replaceAll('%name',data.name)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'report_complete_01':{
            T.subject = report_complete_01.en.subject;  
            T.messageT = report_complete_01.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_complete_01.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            textH = textH.replaceAll('%warranty_type',data.warranty_type)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'rejected_report':{
            T.subject = report_rejected.en.subject;  
            T.messageT = report_rejected.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_rejected.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            textH = textH.replaceAll('%name',data.name)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'report_rejected_01':{
            T.subject = report_rejected_01.en.subject;  
            T.messageT = report_rejected_01.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code)
            let textH = report_rejected_01.en.messageH.replace('%code',data.code)
            const description = data.problem_description.replaceAll('\n','<br />')
            textH = textH.replaceAll('%link',varsLink('WARRANTY')+'/'+data.code)
            textH = textH.replaceAll('%name',data.name)
            textH = textH.replaceAll('%customer',data.customer)
            textH = textH.replaceAll('%dealer',data.dealer)
            textH = textH.replaceAll('%country',data.country)
            textH = textH.replaceAll('%problem_date',data.problem_date)
            textH = textH.replaceAll('%report_date',data.report_date)
            textH = textH.replaceAll('%sales_order',data.aisco_sales_order)
            textH = textH.replaceAll('%invoice',data.invoice)
            textH = textH.replaceAll('%machine_serial_number',data.machine_serial_number)
            textH = textH.replaceAll('%description',description)
            T.messageH = textH;
            break;  
        }
        case 'new_task':{
            T.subject = new_task.en.subject;  
            let textT = new_task.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code+"?task="+data.id)
            T.messageT = textT.replace('%sender',data.sender)
            const description = data.technical_note.replaceAll('\n','<br />')
            let textH = new_task.en.messageH.replace('%sender',data.sender)
            textH = textH.replace('%link',varsLink('WARRANTY')+'/'+data.code+"?task="+data.id)
            textH = textH.replace('%technical_note',description)
            T.messageH = textH;
            break;  
        }
        case 'task_solution':{
            T.subject = task_solution.en.subject;  
            let textT = task_solution.en.messageT.replace('%link',varsLink('WARRANTY')+'/'+data.code+"?task="+data.id)
            T.messageT = textT.replace('%responsible',data.responsible)
            const description = data.solution_note.replaceAll('\n','<br />')
            let textH = task_solution.en.messageH.replace('%responsible',data.responsible)
            textH = textH.replace('%link',varsLink('WARRANTY')+'/'+data.code+"?task="+data.id)
            textH = textH.replace('%solution_note',description)
            T.messageH = textH;
            break;  
        }
        case 'notification':{
            T.subject = notification.en.subject;  
            T.messageT = notification.en.messageT.replace('%sender',data.sender)
            let textH = notification.en.messageH.replace('%sender',data.sender)
            const description = data.text.replaceAll('\n','<br />')
            textH = textH.replace('%text',description)
            textH = textH.replace('%link',varsLink('WARRANTY')+'/'+data.code+"?notification="+data.id)
            T.messageH = textH;
            break;  
        }
    }
    return T;
}

module.exports = {
   fillTemplate
}