import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { DataPoint } from '../../data/DataPoint';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegressionService } from '../../services/regression.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MContainerComponent,CanvasJSAngularChartsModule,CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  x: string;
  y: string;
  dataList: DataPoint[];
  polyno: DataPoint[];
  linear: DataPoint[];
  chartOptions: any; 
  chart: any;

  constructor(private rs: RegressionService){
    this.dataList = [];
    this.linear = [];
    this.polyno = [];
    this.x = "";
    this.y = "";
    this.chartOptions = {
      theme: "light2",
      title: {text: ""},
      axisX:{title: "x"},
      axisY:{title: "y"},
      data: [ {type: "scatter", dataPoints: this.dataList, showInLegend: true, legendText: "Data Points"},
              {type: "line", dataPoints: this.polyno, markerType:"none", showInLegend: true, legendText: "Polynomial Regression"},
              {type: "line", dataPoints: this.linear, markerType:"none", showInLegend: true, legendText: "Linear Regression"}]
    }
  }
  addDataPoint(){
    let newPoint = new DataPoint(+this.x,+this.y);
    this.dataList.push(newPoint);
    try{
      let w1 = this.rs.trainAILinearModel(this.dataList);
      let w3 = this.rs.trainAIPolynomialModel(this.dataList,3);
      this.chartOptions.data = [ 
        {type: "scatter", dataPoints: this.dataList, showInLegend: true, legendText: "Data Points"},
        {type: "line", dataPoints: this.rs.plotModel(this.dataList,w1), markerType:"none",showInLegend: true, legendText: "Linear Regression"},
        {type: "line", dataPoints: this.rs.plotModel(this.dataList,w3), markerType:"none",showInLegend: true, legendText: "Polynomial Regression"}
      ];
    }
    catch(error){
      this.linear.push(newPoint);
      this.polyno.push(newPoint);
    }  
    this.x = "";
    this.y = "";
    
    this.chart.render();
  }
  getChartInstance(chart: object) {
    this.chart = chart;
  }

}
