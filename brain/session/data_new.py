#!/usr/bin/python

'''

This file allows methods defined from the Base, or BaseData superclass to be
overridden, if needed.

Note: the term 'dataset' used throughout various comments in this file,
      synonymously implies the user supplied 'file upload(s)', and XML url
      references.

'''

from brain.session.base_data import BaseData
from brain.database.entity import Entity
from brain.database.dataset import Collection


class DataNew(BaseData):
    '''

    This class provides a generic constructor interface.

    Note: this class is invoked within 'load_data.py'

    Note: inherit base methods from the superclass 'BaseData'

    '''

    def __init__(self, premodel_data):
        '''

        This constructor inherits additional class properties, from the
        constructor of the 'BaseData' superclass.

        '''

        # superclass constructor
        BaseData.__init__(self, premodel_data)

    def save_entity(self, session_type, id_entity=None):
        '''

        This method overrides the identical method from the inherited
        superclass, 'BaseData'. Specifically, this method updates an
        existing entity within the corresponding database table,
        'tbl_dataset_entity'.

        @session_id, is synonymous to 'entity_id', and provides context to
            update 'modified_xx' columns within the 'tbl_dataset_entity'
            database table.

        @numeric_model_type, list indices begin at 0, and needs to be corrected
            by adding 1. This allows the numeric representation of the
            'model_type' to relate to another database table, which maps
            integer values with the corresponding 'model_type' name. The
            integer column of the mapping table begins at 1.

        '''

        # local variables
        db_return = None
        entity = Entity()
        cursor = Collection()
        premodel_settings = self.premodel_data['properties']
        collection = premodel_settings['collection']
        collection_adjusted = collection.lower().replace(' ', '_')
        collection_count = entity.get_collection_count(self.uid)
        document_count = cursor.query(collection_adjusted, 'count_documents')

        # assign numerical representation
        numeric_model_type = self.list_model_type.index(self.model_type) + 1

        # define entity properties
        premodel_entity = {
            'title': premodel_settings.get('session_name', None),
            'collection': collection,
            'model_type': numeric_model_type,
            'uid': self.uid,
        }

        # enfore collection limit for anonymous users
        if (
            not self.uid and
            collection_adjusted and
            collection_count >= self.max_collection
        ):
            entity.remove_entity(0, collection_adjusted)

        # store entity values in database
        if (
            collection_adjusted and
            collection_count < self.max_collection and
            document_count < self.max_document
        ):
            db_save = Entity(premodel_entity, session_type)
            db_return = db_save.save()

        # return
        if db_return and db_return['status']:
            return {'status': True, 'error': None, 'id': db_return['id']}

        else:
            self.list_error.append(db_return['error'])
            return {'status': False, 'error': self.list_error}
