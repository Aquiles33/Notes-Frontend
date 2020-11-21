import { NotesService } from 'src/app/shared/notes.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElementRef: ElementRef<HTMLInputElement>

  constructor(private noteServvice: NotesService) { }

  ngOnInit() {
    this.notes = this.noteServvice.getAll();
    // this.filteredNotes = this.noteServvice.getAll()
    this.filter('');
  }

  deleteNote(note: Note) {
    let noteId = this.noteServvice.getId(note)
    this.noteServvice.delete(noteId);
    this.filter(this.filterInputElementRef.nativeElement.value)
  }
  
  generateNoteUrl(note: Note) {
  let noteId = this.noteServvice.getId(note)
    return noteId
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

    this.sortByRelevancy(allResults)
  }
  
  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e))
    
    return Array.from(uniqueResults);
  }
  
  releventsNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)) {
        return true
      }
      if(note.body && note.body.toLowerCase().includes(query)) {
        return true
      }
      return false
    })
    return relevantNotes
  }

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: Object = {}
    searchResults.forEach(note => {
      let noteId = this.noteServvice.getId(note);

      if(noteCountObj[noteId]) {
        noteCountObj[noteId] += 1
      } else {
        noteCountObj[noteId] = 1
      }
    })
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.noteServvice.getId(a);
      let bId = this.noteServvice.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }

}
