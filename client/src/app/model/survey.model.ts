import { Question } from '../interfaces';

export class Survey
{
  constructor(
    public user?: string, // user's username
    public displayName?: string, // for display purposes only
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public name?: string,
    public dateCreated?: string,
    public dateActive?: string,
    public dateExpire?: string,
    public responses?: number,
    public questions?: Question[]
  ){}
}
