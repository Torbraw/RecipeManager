export class Recetteindexpublique {
  name: string;
  nbStar: number;
  uid: string;
  constructor(n: string, nb: number, u: string) {
    this.uid = u;
    this.name = n;
    this.nbStar = nb;
  }
}
