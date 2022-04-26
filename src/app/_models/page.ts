export class Page {
    // The number of elements in the page
    size: number = 0;
    // The total number of elements
    totalElements: number = 0;
    // The total number of pages
    totalPages: number = 0;
    // The current page number
    pageNumber: number = 0;
    // The current page total number of elements
    pageTotalElements: number = 0;

    pages() {
        const array = [];
        for (let index = 0; index < this.totalPages; index++) {
            array.push(index)
        }
        return array;
    }

    showingResult() {
        const start = this.totalElements > 0 ? (this.pageNumber * this.size) + 1 : 0;
        const end = this.totalElements > 0 ? start + this.pageTotalElements - 1 : 0;
        return 'Showing ' + start + '–' + end + ' of ' + this.totalElements + ' results';
    }
}