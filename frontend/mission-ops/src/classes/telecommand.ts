export class Telecommand {
    telecommandID: number;
    componentID : number;
    command: string;
    name: string;
    defaultPriorityLevel: boolean;
    bandwidthUsage: number;
    powerConsumption: number;
    archived: boolean;

    //this constructor needs to be fixed
    constructor(name: string) {
        this.name = name;
        this.archived = false;
        this.defaultPriorityLevel = false;
        this.componentID = 1;
    }
}