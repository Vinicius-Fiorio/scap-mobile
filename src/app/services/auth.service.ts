import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user:any = {}
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore
  ){ }

  login(fGroup: FormGroup){
    return this.afa.auth.signInWithEmailAndPassword(fGroup.controls['email'].value,fGroup.controls['password'].value)

  }

  async register(fGroup: FormGroup){
    this.user = fGroup
    console.log(this.user.value)
    try{ 
      const newUser = await this.afa.auth.createUserWithEmailAndPassword(fGroup.controls['email'].value,fGroup.controls['password'].value);
      await this.afs.collection('Users').doc(newUser.user.uid).set({
        user: this.user.value.user, 
        email: this.user.value.email,
        tipo: this.user.value.tipo, 
        numeroOAB: this.user.value.numeroOAB});
    }catch(error){
      console.log(error);
    }
  }

  logout(){
    return this.afa.auth.signOut()
  }

  getAuth(){
    return this.afa.auth
  }
}
