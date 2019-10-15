import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Processos } from 'src/app/interfaces/processos';
import { Subscription, Observable } from 'rxjs';
import { ProcessosService } from 'src/app/services/processos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from "../../interfaces/usuario";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  private loading: any
  public processos = new Array<Processos>()
  public processosBuscados = new Array<Processos>()
  //LocalStorage
  public processosBuscado = new Array<Processos>()
  private processosSubscription: Subscription
  public usuario: Usuario
  public usuarioSubscription: Subscription
  public usuarioId: any
  public tipo: string
  public codigo: string
  public resposta: number
  public user: Observable<any[]>
  public processo: any = [];

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private menu: MenuController,
    private processosService: ProcessosService,
    private usuarioService: UsuarioService,
    private toastCtrl: ToastController,
    private processoService: ProcessosService
  ) {
    this.processosSubscription = this.processosService.getProcessos().subscribe(data =>{
      this.processos = data
      console.log(this.processos)
    });

    //AQUI Q A MÁGICA ACONTECE 
    this.usuarioId = this.authService.getAuth().currentUser.uid;
    this.usuarioSubscription = this.usuarioService.getUser(this.usuarioId).subscribe(data =>{
      this.usuario = data;
      this.tipo = this.usuario.tipo
      console.log(this.tipo, this.usuarioId, this.usuario.numeroOAB);
    });

    //calma
    if(this.tipo == 'Comum'){
      this.loadtudo()
    }
    
  }

  ngOnInit(){  
    
  }

  
  ngOnDestroy(){
    this.processosSubscription.unsubscribe()
  }
  
  addProcesso(id: string){
   try{
    this.processosSubscription = this.processoService.getProcesso(id).subscribe(data =>{
      this.processo = data
      console.log(this.processo)
      let tamanho = JSON.parse(window.localStorage.getItem('meus-processos'))
      if(tamanho == null ){
        window.localStorage.setItem('meus-processos', JSON.stringify(this.processo))
        this.presentToast('Primeiro processo adicionado')
      }else{
        let existing = [JSON.parse(window.localStorage.getItem('meus-processos'))]
        existing.push(this.processo)
        window.localStorage.setItem('meus-processos', JSON.stringify(existing))
        this.presentToast('Adicionado com sucesso')
      }});
      
    }catch(error){
      this.presentToast('Erro ao tentar Adicionar')
    }
  }

  loadtudo(){
    this.processosBuscado = JSON.parse(window.localStorage.getItem('meus-processos'))
    console.log(this.processosBuscado) 
  }

  async deleteProcesso(id: string){
    try{
      await this.processosService.deleteProcesso(id)
    }catch(error){
      this.presentToast('Erro ao tentar excluir')
    }
  }

  //Tratamento do logout
  async logout(){
    await this.presentLoading()

    try{
      await this.authService.logout()
    }catch(error){
      console.log(error)
 
    }finally{
      this.loading.dismiss()
    }
  }
  //Menu Lateral
  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  //ionic animação de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde ...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
