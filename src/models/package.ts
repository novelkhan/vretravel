export interface PackageImage {
    packageImageId?: number;
    filename?: string;
    filetype?: string;
    filesize?: string;
    filebytes?: any;
    packageDataId?: number;
    imageFile?: any;
    url?: any;
  }
  
  export interface PackageData {
    packageDataId?: number;
    description?: string;
    viaDestination?: string;
    date?: string;
    availableSeat?: number;
    packageImages?: PackageImage[];
    packageId?: number;
  }
  
  export interface Package {
    packageId: number;
    packageName: string;
    destination: string;
    price: string;
    dateCreated?: string;
    packageData?: PackageData;
  }
  
  export interface AddPackage {
    packagename: string;
    destination: string;
    price: string;
  }  