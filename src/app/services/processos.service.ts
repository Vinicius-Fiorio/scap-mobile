import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Processos } from '../interfaces/processos';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProcessosService {
  private processosCollection: AngularFirestoreCollection<Processos> 

  constructor(
    private afs: AngularFirestore) {
    this.processosCollection = this.afs.collection<Processos>('Processos')
   }

   getProcessos(){
      return this.processosCollection.snapshotChanges().pipe(
        map(actions =>{
          return actions.map( a =>{
            const data = a.payload.doc.data();
            const id = a.payload.doc.id

            return {id, ...data}
          })
        })
      )
   }
   addProcesso(processo: Processos){
     return this.processosCollection.add(processo)
   }

   getProcesso(id: string){
     return this.processosCollection.doc<Processos>(id).valueChanges();
   }

   updateProcesso(id: string , processo: Processos){
     return this.processosCollection.doc<Processos>(id).update(processo)
   }

   deleteProcesso(id: string){
     return this.processosCollection.doc(id).delete()
   }
}
