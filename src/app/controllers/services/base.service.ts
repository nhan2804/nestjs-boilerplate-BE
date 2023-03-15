import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ERROR_CODE } from '../../constants/error.cons';
import { BaseDocument, BaseModel } from '../../models/base.schema';
import { ULog, UResult, UThrowError } from 'src/helper/ulti';
export type ID = string | Types.ObjectId;
@Injectable()
export class BaseService<T, S = T & BaseDocument> {
  protected model: Model<S>;
  constructor(
    // @InjectModel(BaseModel.name)
    model: Model<S>,
  ) {
    this.model = model;
  }

  async baseCreate(data: T, errorCallback = null) {
    try {
      const result = await new this.model(data).save();
      if (!result) {
        return UResult(false, `${ERROR_CODE.NO_DATA_MATCH}`, result);
      }

      return UResult(true, '', result);
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_CREATE_ERROR,
          );
    }
  }

  async baseCreateArray(datas: T[], errorCallback = null) {
    try {
      const result = await this.model.insertMany(datas);
      if (!result || result.length <= 0) {
        return UResult(false, `${ERROR_CODE.NO_DATA_MATCH}`, result);
      }

      return UResult(true, '', result);
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_CREATE_ARRAY_ERROR,
          );
    }
  }

  async baseFilter(
    filter?: FilterQuery<T>,
    sort = {},
    offset = 0,
    limit = 20,
    errorCallback = null,
  ) {
    try {
      const result = await this.model
        .find(filter || {})
        .sort(
          !sort || Object.keys(sort).length === 0 ? { createdAt: -1 } : sort,
        )
        .skip(offset)
        .limit(limit)
        .exec();
      if (!result || result.length <= 0) {
        return UResult(false, `${ERROR_CODE.NO_DATA_MATCH}`, result);
      }

      return UResult(true, '', result);
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_FILTER_ERROR,
          );
    }
  }

  async baseFindOne(id: ID, errorCallback = null) {
    try {
      const result = await this.model.findOne({ _id: id }).exec();
      if (!result) {
        return UResult(false, `${ERROR_CODE.NO_DATA_MATCH}`, result);
      }

      return UResult(true, '', result);
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_FIND_ONE_ERROR,
          );
    }
  }

  async baseUpdateMany(filter: T, values: T[], errorCallback = null) {
    try {
      const result = await this.model
        .updateMany(filter, [{ $set: values }])
        .exec();
      return UResult(
        result.modifiedCount > 0,
        result.modifiedCount > 0
          ? ''
          : result.matchedCount > 0
          ? `${ERROR_CODE.NO_DATA_CHANGE}`
          : `${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_UPDATE_MANY_ERROR,
          );
    }
  }

  async baseUpdateArray(values: any[], errorCallback = null) {
    try {
      const result = await this.model.bulkWrite(values);
      return UResult(
        result.nModified > 0,
        result.nModified > 0
          ? ''
          : result.nMatched > 0
          ? `${ERROR_CODE.NO_DATA_CHANGE}`
          : `${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      console.log(error);
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_UPDATE_ARRAY_ERROR,
          );
    }
  }

  async baseUpdateOne(
    id: ID,
    data: T & { _id?: string },
    errorCallback = null,
  ) {
    if (data?._id) delete data?._id;
    try {
      const result = await this.model
        .updateOne({ _id: id }, data, { new: true })
        .exec();

      return UResult(
        result.modifiedCount > 0,
        result.modifiedCount > 0
          ? ''
          : result.matchedCount > 0
          ? `${ERROR_CODE.NO_DATA_CHANGE}`
          : `${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_UPDATE_ONE_ERROR,
          );
    }
  }

  async baseDeleteMany(filter: T, errorCallback = null) {
    try {
      const result = await this.model.deleteMany(filter).exec();
      return UResult(
        result.deletedCount > 0,
        result.deletedCount > 0
          ? ''
          : `TABLE PROJECTS ${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_DELETE_ONCE_ERROR,
          );
    }
  }

  async baseDeleteOnce(id: ID, errorCallback = null) {
    try {
      const result = await this.model.deleteOne({ _id: id }).exec();
      return UResult(
        result.deletedCount > 0,
        result.deletedCount > 0
          ? ''
          : `TABLE PROJECTS ${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_DELETE_MANY_ERROR,
          );
    }
  }
}
