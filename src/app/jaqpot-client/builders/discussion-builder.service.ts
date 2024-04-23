import { Injectable } from '@angular/core';
import { Discussion } from '../model/discussion';
import { MetaInfo } from '../model/models';
import { Reply } from '../model/reply';

@Injectable({
  providedIn: 'root',
})
export class DiscussionBuilderService {
  private discussion: Discussion;

  constructor() {
    this.discussion = <Discussion>{};
  }

  public setEntityId(entityId: string) {
    this.discussion.onEntity = entityId;
    return this;
  }

  public setComment(comment: string) {
    this.discussion.comment = comment;
    return this;
  }

  public setMeta(meta: MetaInfo) {
    this.discussion.meta = meta;
    return this;
  }

  public setReply(reply: Reply) {
    this.discussion.replies.push(reply);
    return this;
  }

  public build() {
    return this.discussion;
  }
}
