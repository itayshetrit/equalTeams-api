export const responseWrapper = (status, data) => {
    let responseObject = {};
    responseObject['status'] = status;
    responseObject['data'] = data;
    return responseObject;
};

export const responseSuccess = (data) => {
    return responseWrapper(200, data);
};