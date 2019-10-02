import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from "../interfaces/usuario";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private userCollection: AngularFirestoreCollection<Usuario>
  private user: Observable<Usuario[]>

  constructor(private db: AngularFirestore) {
    this.userCollection = this.db.collection<Usuario>('Users');
    this.user = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getUsers(){
    return this.user
  }

  getUser(id){
    return this.userCollection.doc<Usuario>(id).valueChanges();
  }
}
