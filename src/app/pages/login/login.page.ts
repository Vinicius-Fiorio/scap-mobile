import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides :IonSlides;

  public fGroup: FormGroup
  public oab:boolean
  public loading:any

  constructor(
    public fBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
    ) {
      this.fGroup = fBuilder.group({
        'user':['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
  
        ])],
        'email':['', Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
  
        ])],
        'password':['', Validators.compose([
          Validators.required,
          Validators.minLength(8)
  
        ])],
        'tipo':['Comum'],
        'numeroOAB':[null]
      })
   }

  ngOnInit() {
  }

  segmentChanged(event:any){
    if(event == 1){
      this.slides.slideNext()
    }else{
      this.slides.slidePrev()
    }
  }

  mostrar(data){
    if(data === 1){
      this.oab = true;
      this.fGroup.controls['tipo'].setValue('Advogado');
      this.fGroup.get('numeroOAB').setValidators([Validators.minLength(4), Validators.required]);
    }else{
      this.oab = false;
      this.fGroup.controls['tipo'].setValue('Comum');
      this.fGroup.controls['numeroOAB'].setValue(null)
      this.fGroup.controls['numeroOAB'].clearValidators();
      this.fGroup.controls['numeroOAB'].setErrors(null);
      this.fGroup.controls['numeroOAB'].reset();
    } 
  }
  
  async cadastrar(){
    await this.presentLoading()

    try{
      await this.authService.register(this.fGroup)
        this.presentToast('Cadastrado com Sucesso')
    }catch(error){
      let message: string

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'E-mail já Cadastrado'
          break;
      }
      this.presentToast(message)
 
    }finally{
      this.loading.dismiss()
    }
  }

  async entrar(){
    await this.presentLoading()
    try{
      await this.authService.login(this.fGroup)
        this.presentToast('Logado com sucesso')
    }catch(error){
      let message: string

      switch(error.code){
        case 'auth/invalid-email':
          message = "E-mail inválido"
          break;
        case 'auth/user-not-found':
          message = "E-mail ou senha inválidos"
          break;
        case 'auth/wrong-password':
          message = "Senha inválida"
          break;
      }
      this.presentToast(message)
      
    }finally{
      this.loading.dismiss()
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
