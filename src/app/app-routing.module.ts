import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OperarioComponent} from "./components/operario/operario.component";
import {OperarioFormularioComponent} from "./components/operario-formulario/operario-formulario.component";
import {PedidoComponent} from "./components/pedido/pedido.component";
import {PedidoFormularioComponent} from "./components/pedido-formulario/pedido-formulario.component";

const routes: Routes = [
  { path: '', component: OperarioComponent },
  { path: 'operario', component: OperarioComponent },
  { path: 'operario-formulario', component: OperarioFormularioComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'pedido-formulario', component: PedidoFormularioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
