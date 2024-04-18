import { Injectable } from '@angular/core';
import { DataPoint } from '../data/DataPoint';
import * as math from 'mathjs';
//npm install @types/mathjs

@Injectable({
  providedIn: 'root'
})
export class RegressionService {

  constructor() { }

  trainAIPolynomialModel(dataList: DataPoint[], degree: number){
    let X = this.buildXMathMatrix(dataList,degree);
    let y = this.buildYVector(dataList);
    let XT = math.transpose(X);
    let XTX = math.multiply(XT,X);
    let XTXinv = math.inv(XTX);
    let XTXinvXT = math.multiply(XTXinv,XT);
    let w = math.multiply(XTXinvXT,y);
    return w; 
  }
  trainAILinearModel(dataList: DataPoint[]){
    return this.trainAIPolynomialModel(dataList,1);
  }
  predict(x: number, w: any){
    let X = new Array<number>();
    X.push(1);
    X.push(x);
    for(let i = 2; i <= w.size()[0]-1; i++) X.push(x ** i);
    return math.multiply(math.transpose(math.matrix(X)),w);
  }
  plotModel(list:DataPoint[], w: any){
    let predictedPoints: DataPoint[] = new Array<DataPoint>();
    let minX = list[0].x;
    let maxX = list[0].x;
    for (let i = 0 ; i < list.length; i++)
    {
      if(list[i].x < minX) minX = list[i].x;
      if(list[i].x > maxX) maxX = list[i].x;   
    }
    for (let x = minX ; x < maxX; x+=0.1)
    {
      let y_w:any = this.predict(x, w);
      predictedPoints.push(new DataPoint(x,y_w));
    }
    return predictedPoints;
  }
  buildYVector(list: DataPoint[]){
    let vector = new Array<number>();
    for (let i = 0; i< list.length; i++)
      vector.push(list[i].y);
    return math.matrix(vector);
  }
  buildXMathMatrix(list: DataPoint[], degree: number){
    let matrix: Array<number>[] = [];
    for (let i = 0; i< list.length; i++)
    {
      let row = new Array<number>();
      row.push(1);
      row.push(list[i].x);
      for(let j = 2; j <= degree; j++)   row.push(list[i].x ** j);
      matrix.push(row);
    }
    return math.matrix(matrix);
  }
}
