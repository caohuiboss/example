import service from '@/utils/request'

export function SelectAnswerPaper(data) {
    return service({
        url: 'KS_AnswerPaper/SelectAnswerPaper',
        method: 'post',
        data
    })
}

export function SelectAnswerPaperDetailById(data) {
    return service({
        url: 'KS_AnswerPaper/SelectAnswerPaperDetailById',
        method: 'post',
        data
    })
}

export function InsertAnswerPaper(data) {
    return service({
        url: 'KS_AnswerPaper/InsertAnswerPaper',
        method: 'post',
        data
    })
}

export function InsertRetakeAnswerPaper(data) {
    return service({
        url: 'KS_AnswerPaper/InsertRetakeAnswerPaper',
        method: 'post',
        data
    })
}

export function AutomaticScore(data) {
    return service({
        url: 'KS_AnswerPaper/AutomaticScore',
        method: 'post',
        data
    })
}

export function UpdateTotalScore(data) {
    return service({
        url: 'KS_AnswerPaper/UpdateTotalScore',
        method: 'post',
        data
    })
}

export function SelectUserPaper(data) {
    return service({
        url: 'KS_AnswerPaper/SelectUserPaper',
        method: 'post',
        data
    })
}



