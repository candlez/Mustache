import OrderedAnimationManager from "../common/OrderedAnimationManager.js";
import Animation from "./../common/Animation.js"
import MoveableAnimation from "./../common/MoveableAnimation.js"

describe('unit testing for OrderedAnimationManager', () => {
    var manager;

    beforeEach(() => {
        manager = new OrderedAnimationManager();
    })

    test('testing addAnimation', () => {
        var array = [new Animation(), new MoveableAnimation(10, 20), new Animation()]
        manager.addAnimation(array[1]);
        manager.addAnimation(array[2]);
        manager.addAnimation(array[0], 0);

        expect(manager.size()).toBe(3);
        expect(manager.getAnimations()).toStrictEqual(array);
    })

    test('testing removeAnimation', () => {
        var a1 = new MoveableAnimation(10, 20);
        var a2 = new MoveableAnimation(30, 30);
        var a3 = new MoveableAnimation(50, 50);
        var a4 = new MoveableAnimation(10, 20);

        manager.addAnimation(a1);
        manager.addAnimation(a3);
        manager.addAnimation(a2);
        manager.addAnimation(a4);

        // won't remove objects with the same values
        manager.removeAnimation(a4);

        // if values within animation are updated elsewhere, also updated within the manager
        a3.setXCoord(20);
        expect(manager.getAnimations()[1].getXCoord()).toBe(20);
        manager.removeAnimation(a3);

        manager.removeAnimation(a2);
        expect(manager.getAnimations()).toStrictEqual([a1]);
        expect(manager.size()).toBe(1);

        manager.removeAnimation(a1);
        expect(manager.getAnimations()).toStrictEqual([]);
        expect(manager.size()).toBe(0);
    })
})