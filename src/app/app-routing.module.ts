import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OperarioComponent} from "./components/operario/operario.component";
import {OperarioFormularioComponent} from "./components/operario-formulario/operario-formulario.component";

const routes: Routes = [
  { path: '', component: OperarioComponent },
  { path: 'operario', component: OperarioComponent },
  { path: 'operario-formulario', component: OperarioFormularioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
