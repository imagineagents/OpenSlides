from config.models import config
from projector import SLIDE, Slide


def get_slide_from_sid(sid):
    data = sid.split('-')
    if len(data) == 2:
        model = data[0]
        id = data[1]
        return SLIDE[model].model.objects.get(pk=id).slide()
    if len(data) == 1:
        try:
            return SLIDE[data[0]].func()
        except KeyError:
            return None
    return None


def get_active_slide(only_sid=False):
    """
    Returns the active slide. If no slide is active, or it can not find an Item,
    it raise an error

    if only_sid is True, returns only the id of this item. Returns None if not Item
    is active. Does not Raise Item.DoesNotExist
    """
    sid = config["presentation"]

    if only_sid:
        return sid
    return get_slide_from_sid(sid)


def set_active_slide(sid):
    config["presentation"] = sid


def register_slidemodel(model, model_name=None):
    #TODO: Warn if there already is a slide with this prefix
    if model_name is None:
        model_name = model.prefix

    category = model.__module__.split('.')[0]
    SLIDE[model.prefix] = Slide(
        model_slide=True,
        model=model,
        category=category,
        key=model.prefix,
        model_name=model_name,
    )


def register_slidefunc(key, func):
    #TODO: Warn if there already is a slide with this prefix
    category = func.__module__.split('.')[0]
    SLIDE[key] = Slide(
        model_slide=False,
        func=func,
        category=category,
        key=key,
    )


#def get_possible_slides():

