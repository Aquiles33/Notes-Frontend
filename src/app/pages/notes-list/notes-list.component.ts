import { NotesService } from 'src/app/shared/notes.service';
import { Component, OnInit } from '@angular/core';

import { Note } from 'src/app/shared/note.module';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition('void => *', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*',
        })),
        animate(100)
      ]),
      transition('* => void', [
        // firts scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        // then animet the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          opacity: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.2s ease')    
          ])
        ], {
          optional: true
        })
      ])
    ]) 
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>()
  filteredNotes: Note[] = new Array<Note>()

  constructor(private noteServvice: NotesService) { }

  ngOnInit() {
    this.notes = this.noteServvice.getAll();
    this.filteredNotes = this.notes
  }

  deleteNote(id: number) {
    this.noteServvice.delete(id);
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms)
    terms.forEach(term => {
      let results: Note[] = this.releventsNotes(term);;
      allResults = [...allResults, ...results]
    })

    let uniqueResults = this.removeDuplicates(allResults)
    this.filteredNotes = uniqueResults;
  }
  
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e))
    
    return Array.from(uniqueResults);
  }
  
  releventsNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.body.toLowerCase().includes(query) || note.title.toLowerCase().includes(query)) {
        return true
      }
      return false
    })
    return relevantNotes
  }

}
