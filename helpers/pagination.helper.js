
module.exports = (limitItem, query, count) => {
    const objectPagination = {
        currentPage: 1,
        limitItem: limitItem
    };
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }else{
        objectPagination.currentPage[1];
    }
    objectPagination.skip = (objectPagination.currentPage - 1)* objectPagination.limitItem;
    
    objectPagination.totalPage = Math.ceil(count/objectPagination.limitItem);

    return objectPagination;
}