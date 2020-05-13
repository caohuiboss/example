import service from '@/utils/request'

export function InsertTopic(data) {
    return service({
        url: '/KS_Topic/InsertTopic',
        method: 'post',
        data
    })
}

export function SelectTopic(data) {
    return service({
        url: '/KS_Topic/SelectTopic',
        method: 'post',
        data
    })
}

export function DeleteTopic(data) {
    return service({
        url: '/KS_Topic/DeleteTopic',
        method: 'post',
        data
    })
}

export function UpdateTopic(data) {
    return service({
        url: '/KS_Topic/UpdateTopic',
        method: 'post',
        data
    })
}

export function SelectTopicDetailByTopicID(data) {
    return service({
        url: '/KS_Topic/SelectTopicDetailByTopicID',
        method: 'post',
        data
    })
}

export function SelectAllTopicDetail(data) {
    return service({
        url: '/KS_Topic/SelectAllTopicDetail',
        method: 'post',
        data
    })
}


