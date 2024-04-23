import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { DiscussionBuilderService } from '../../jaqpot-client/builders/discussion-builder.service';
import { MetaBuilderService } from '../../jaqpot-client/builders/meta-builder.service';
import { SessionService } from '../../session/session.service';
import { MetaInfo } from '../../jaqpot-client';
import { Discussion } from '../../jaqpot-client/model/discussion';
import { DiscussionService } from '../../jaqpot-client/api/discussion.service';
import { Reply } from '../../jaqpot-client/model/reply';
import { UserService } from '../../jaqpot-client/api/user.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '@euclia/accounts-client';
import { ModelService } from '../../jaqpot-client/api/model.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewPort: CdkVirtualScrollViewport;

  batch = 5;
  theEnd = false;

  userId: string;
  offset = new BehaviorSubject(null);

  comment: string;
  saveButton: boolean = false;
  replyButton: boolean = false;

  total: string;

  totalFound: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  discussions: Discussion[] = [];

  discussionsAll: DiscussionAll[] = [];

  discussionToReply: DiscussionAll;

  inited: boolean = false;
  viewDisc: boolean = false;
  scrollTo: number = 0;
  private entityId: string;

  constructor(
    private _discussionApi: DiscussionService,
    private _discussionBuilder: DiscussionBuilderService,
    private _metaBuilder: MetaBuilderService,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _dialogsService: DialogsService,
    private readonly modelService: ModelService,
  ) {}

  ngOnInit() {
    this.userId = this._sessionService.getUserId();

    const offset = 0;
    const size = 10;

    this.modelService.currentModel$.subscribe(({ entityId }) => {
      this.entityId = entityId;
      const params = new HttpParams()
        .set('entityid', this.entityId)
        .set('start', offset.toString())
        .set('max', size.toString());
      this._discussionApi.getList(params).subscribe((resp: Discussion[]) => {
        resp.forEach((disc) => {
          const discussionAll = <DiscussionAll>{};
          discussionAll.replyAll = [];
          discussionAll.discussion = disc;

          this._userService.getUserById(disc.meta.creators[0]).then((user) => {
            discussionAll.user = user;
          });
          if (typeof disc.replies != 'undefined') {
            disc.replies.forEach((repl: Reply) => {
              const replAll = <ReplyAll>{};
              replAll.reply = repl.reply;
              this._userService.getUserById(repl.owner).then((user) => {
                replAll.user = user;
              });
              discussionAll.replyAll.push(replAll);
            });
          }
          if (disc.meta.creators[0] === this.userId) {
            discussionAll.delete = true;
          }
          this.discussionsAll.push(discussionAll);
        });
        this.discussions = resp;
      });
      const paramsCount = new HttpParams().set('entityid', this.entityId);
      this._discussionApi
        .count(paramsCount)
        .subscribe((count: HttpResponse<Discussion>) => {
          const tot = count.headers.get('total');
          this.viewDisc = true;
          this.totalFound = Number(tot);
        });
    });
  }

  commentChanged() {
    if (this.comment.length > 0) {
      this.saveButton = true;
    } else {
      this.saveButton = false;
    }
  }

  saveDiscussion() {
    this.viewDisc = false;
    const ownerId = this._sessionService.getUserId();
    this._metaBuilder.setCreators(ownerId);
    const meta: MetaInfo = this._metaBuilder.build();
    const discussion: Discussion = this._discussionBuilder
      .setMeta(meta)
      .setEntityId(this.entityId)
      .setComment(this.comment)
      .build();
    this._discussionApi.postEntity(discussion).subscribe((resp: Discussion) => {
      {
        const discussionAll = <DiscussionAll>{};
        discussionAll.discussion = resp;
        this._userService.getUserById(resp.meta.creators[0]).then((user) => {
          discussionAll.user = user;
        });
        if (resp.meta.creators[0] === this.userId) {
          discussionAll.delete = true;
        }
        if (typeof resp.replies != 'undefined') {
          resp.replies.forEach((repl: Reply) => {
            const replAll = <ReplyAll>{};
            replAll.reply = repl.reply;
            this._userService.getUserById(repl.owner).then((user) => {
              replAll.user = user;
            });
            discussionAll.replyAll.push(replAll);
          });
        }

        this.totalFound = Number(this.totalFound) + 1;
        this.discussionsAll.unshift(discussionAll);
        this.viewDisc = true;
        // this.infinite = of(this.discussionsAll)
        this.comment = '';
        this.saveButton = false;
      }
    });
  }

  openUserDialog(user: User) {
    this._dialogsService.quickUser(this._userService, user);
  }

  appendDiscussionAll() {}

  reply(disc: DiscussionAll) {
    // let updateDisc =  this.discussionsAll.find(this.findIndexToUpdate(disc), disc.discussion._id)
    this.viewDisc = false;
    const updateit = this.discussionsAll.indexOf(disc);
    disc.reply = true;
    this.discussionToReply = disc;
    this.discussionsAll[updateit] = disc;
    this.viewDisc = true;
    // this.infinite = of(this.discussionsAll)
  }

  findIndexToUpdate(disc: DiscussionAll) {
    return disc.discussion._id;
  }

  replyChanged() {
    this.viewDisc = false;
    if (this.discussionToReply.replyTemp.length > 0) {
      this.replyButton = true;
    } else {
      this.replyButton = false;
    }
    this.viewDisc = true;
  }

  updateDiscussion() {
    this.viewDisc = false;
    const reply = <Reply>{};
    reply.reply = this.discussionToReply.replyTemp;
    reply.owner = this._sessionService.getUserId();
    let discussionToUpdate = <Discussion>{};
    discussionToUpdate = this.discussionToReply.discussion;
    if (typeof discussionToUpdate.replies != 'undefined') {
      discussionToUpdate.replies.push(reply);
    } else {
      discussionToUpdate.replies = [];
      discussionToUpdate.replies.push(reply);
    }

    const updateit = this.discussionsAll.indexOf(this.discussionToReply);

    this._discussionApi
      .putEntitySecured(discussionToUpdate)
      .subscribe((resp: Discussion) => {
        const discussionAll = <DiscussionAll>{};
        discussionAll.replyAll = [];
        discussionAll.discussion = resp;
        if (resp.meta.creators[0] === this.userId) {
          discussionAll.delete = true;
        }
        this._userService.getUserById(resp.meta.creators[0]).then((user) => {
          discussionAll.user = user;
        });
        if (typeof resp.replies != 'undefined') {
          resp.replies.forEach((repl: Reply) => {
            const replAll = <ReplyAll>{};
            replAll.reply = repl.reply;
            this._userService.getUserById(repl.owner).then((user) => {
              replAll.user = user;
            });
            discussionAll.replyAll.push(replAll);
          });
        }
        this.discussionsAll[updateit] = discussionAll;
        this.viewDisc = true;
        // this.infinite = of(this.discussionsAll)
      });
  }

  viewReplies(disc: DiscussionAll) {
    const updateit = this.discussionsAll.indexOf(disc);
    disc.viewReply = true;
    this.discussionsAll[updateit] = disc;

    // this.infinite = of(this.discussionsAll)
  }

  nextBatch(e, offset) {
    // console.log(this.totalFound)
    // console.log(this.discussionsAll.length)

    // console.log(this.viewPort.measureRenderedContentSize() - this.viewPort.measureScrollOffset())
    // console.log(this.viewPort.getDataLength())

    // console.log(this.viewPort.measureRenderedContentSize())
    // console.log(this.viewPort.measureScrollOffset())
    // console.log(this.viewPort.)
    if (e > this.scrollTo) {
      this.viewPort.scrollToIndex(e);
      this.scrollTo = e;
    } else {
      this.viewPort.scrollToIndex(this.scrollTo);
      this.scrollTo = e;
    }

    if (
      this.discussionsAll.length === this.totalFound ||
      this.discussionsAll.length > this.totalFound
    ) {
      return;
    }

    const end = this.viewPort.getRenderedRange().end;
    const total = this.viewPort.getDataLength();
    this.inited = true;

    if (e > this.scrollTo) {
      this.viewPort.scrollToIndex(e);
      this.scrollTo = e;
    } else {
      this.viewPort.scrollToIndex(this.scrollTo);
      this.scrollTo = e;
    }

    // if(this.viewPort.measureRenderedContentSize() - this.viewPort.measureScrollOffset() < 800
    //   && this.viewPort.measureRenderedContentSize() - this.viewPort.measureScrollOffset() > 300)

    if (this.viewPort.getRenderedRange().end - e < 8) {
      const start = this.viewPort.getDataLength();
      const max = start + this.batch;
      this.viewDisc = false;
      const params = new HttpParams()
        .set('entityid', this.entityId)
        .set('min', start.toString())
        .set('max', max.toString());
      this.scrollTo = e;
      this._discussionApi.getList(params).subscribe((resp: Discussion[]) => {
        resp.forEach((disc) => {
          const discussionAll = <DiscussionAll>{};
          discussionAll.replyAll = [];
          discussionAll.discussion = disc;
          this._userService.getUserById(disc.meta.creators[0]).then((user) => {
            discussionAll.user = user;
          });
          if (typeof disc.replies != 'undefined') {
            disc.replies.forEach((repl: Reply) => {
              const replAll = <ReplyAll>{};
              replAll.reply = repl.reply;
              this._userService.getUserById(repl.owner).then((user) => {
                replAll.user = user;
              });

              if (!this.discussionsAll.includes(discussionAll)) {
                this.discussionsAll.push(discussionAll);
              }
              this.viewDisc = true;
            });
          }
          if (!this.discussionsAll.includes(discussionAll)) {
            this.discussionsAll.push(discussionAll);
          }

          this.viewDisc = true;
        });
        this.discussions = resp;
      });
      this.viewPort.scrollToIndex(this.scrollTo);
    }

    this.viewPort.scrollToIndex(this.scrollTo);

    if (end === this.totalFound) {
      this.offset.next(offset);
    }

    this.viewPort.scrollToIndex(this.scrollTo);
  }

  delete(disc: DiscussionAll) {
    const updateit = this.discussionsAll.indexOf(disc);
    this._dialogsService
      .confirmDeletion('Are you sure you want to delete?', 'DELETE')
      .subscribe((resp) => {
        if (resp === true) {
          this._discussionApi
            .deleteEntity(disc.discussion._id)
            .subscribe((resp) => {
              this.totalFound = Number(this.totalFound) - 1;
              this.discussionsAll.splice(updateit, 1);
            });
        }
      });
  }

  ngOnDestroy() {
    this.discussionsAll = [];
  }

  hideReply(disc: DiscussionAll) {
    disc.viewReply = false;
  }
}

export interface DiscussionAll {
  user?: User;
  delete?: boolean;
  discussion?: Discussion;
  replyAll?: ReplyAll[];
  reply?: boolean;
  replyTemp?: string;
  viewReply?: boolean;
}

export interface ReplyAll {
  user?: User;
  reply?: string;
}
