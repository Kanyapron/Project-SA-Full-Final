export interface ProductsInterface {
    ID?: number;
	Title?:           string;
	Description?:     string;
	Price?:           GLfloat;
	PictureProduct?: string ;
	Weight?:          GLfloat;
	Status?:          string;	
	CategoryID?:        number;
	ConditionID?:       number;
	SellerId?: number;
}