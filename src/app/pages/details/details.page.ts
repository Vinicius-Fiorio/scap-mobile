import { Component, OnInit } from '@angular/core';
import { Processos } from 'src/app/interfaces/processos';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProcessosService } from 'src/app/services/processos.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  public processo: Processos = {}
  private loading: any
  private processoId: string = null
  private processoSubscription: Subscription 

  constructor(
    private loadingCtrl:LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private processoService: ProcessosService,
    private NavCtrl: NavController
  ) {
    this.processoId = this.activeRoute.snapshot.params['id']

    if(this.processoId) this.loadProcesso()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.processoSubscription) this.processoSubscription.unsubscribe();
  }

  loadProcesso(){
    this.processoSubscription = this.processoService.getProcesso(this.processoId).subscribe(data =>{
      this.processo = data
    });
  }

  async saveProcesso(){
    await this.presentLoading()

    this.processo.userId = this.authService.getAuth().currentUser.uid

    if(this.processoId){
      try{
        await this.processoService.updateProcesso(this.processoId, this.processo)
        await this.loading.dismiss()

        this.NavCtrl.navigateBack('/home')
      }catch(error){
        this.presentToast(error)
        this.loading.dismiss()
      }
    }else{
      this.processo.createdAt = new Date().getTime();

      try{
        await this.processoService.addProcesso(this.processo)
        await this.loading.dismiss()

        this.NavCtrl.navigateBack('/home')
      }catch(error){
        this.presentToast(error)
        this.loading.dismiss()
      }
    }
  } 

  //animação ionic
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde ...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
