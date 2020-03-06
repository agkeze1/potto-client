export interface iPagination {
	limit: number;
	page: number;
	totalDocs: number;
	totalPages: number;
	nextPage: any;
	prevPage: any;
	length: number;
	onPageClicked: any;
}
