import service from '@/utils/request'

export function InsertPlan(data) {
    return service({
        url: '/PX_Plan/InsertPlan',
        method: 'post',
        data
    })
}

export function SelectPlan(data) {
    return service({
        url: '/PX_Plan/SelectPlan',
        method: 'post',
        data
    })
}

export function SelectPlanDetailByPlanID(data) {
    return service({
        url: '/PX_Plan/SelectPlanDetailByPlanID',
        method: 'post',
        data
    })
}

export function DeletePlan(data) {
    return service({
        url: '/PX_Plan/DeletePlan',
        method: 'post',
        data
    })
}

export function UpdatePlan(data) {
    return service({
        url: '/PX_Plan/UpdatePlan',
        method: 'post',
        data
    })
}