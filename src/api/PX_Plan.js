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

export function SelectTopicDetailByTopicID(data) {
    return service({
        url: '/PX_Plan/SelectTopicDetailByTopicID',
        method: 'post',
        data
    })
}

export function DeleteTopic(data) {
    return service({
        url: '/PX_Plan/DeleteTopic',
        method: 'post',
        data
    })
}

export function UpdateTopic(data) {
    return service({
        url: '/PX_Plan/UpdateTopic',
        method: 'post',
        data
    })
}