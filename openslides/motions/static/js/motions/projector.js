(function () {

'use strict';

angular.module('OpenSlidesApp.motions.projector', [
    'OpenSlidesApp.motions',
    'OpenSlidesApp.motions.motionservices',
    'OpenSlidesApp.motions.motionBlockProjector',
])

.config([
    'slidesProvider',
    function(slidesProvider) {
        slidesProvider.registerSlide('motions/motion', {
            template: 'static/templates/motions/slide_motion.html',
        });
    }
])

.controller('SlideMotionCtrl', [
    '$scope',
    'Config',
    'Motion',
    'MotionChangeRecommendation',
    'ChangeRecommendationView',
    'User',
    'Notify',
    'ProjectorID',
    function($scope, Config, Motion, MotionChangeRecommendation, ChangeRecommendationView, User, Notify, ProjectorID) {
        // Attention! Each object that is used here has to be dealt on server side.
        // Add it to the coresponding get_requirements method of the ProjectorElement
        // class.
        var motionId = $scope.element.id;
        $scope.mode = $scope.element.mode || 'original';
        $scope.lineNumberMode = Config.get('motions_default_line_numbering').value;

        var notifyNamePrefix = 'projector_' + ProjectorID() + '_motion_line_';
        var callbackId = Notify.registerCallback(notifyNamePrefix + 'request', function (params) {
            var line = params.params.line;
            if (!line) {
                return;
            }

            var scrollTop = null;
            $('.line-number-' + line).each(function() {
                var top = $(this).offset().top;
                if (scrollTop === null || top < scrollTop) {
                    scrollTop = top;
                }
            });
            if (scrollTop) {
                scrollTop += (-$scope.scroll); // Add the (reversed) scrolling ontop
                var scroll = Math.floor((scrollTop/250) - 0.2);
                var channel = params.senderReplyChannelName;
                Notify.notify(notifyNamePrefix + 'answer', {scroll: scroll}, null, [channel], null);
            }
        });
        $scope.$on('$destroy', function () {
            Notify.deregisterCallback(callbackId);
        });

        User.bindAll({}, $scope, 'users');

        $scope.$watch(function () {
            return Motion.lastModified(motionId);
        }, function () {
            $scope.motion = Motion.get(motionId);
            $scope.amendment_diff_paragraphs = $scope.motion.getAmendmentParagraphsLinesDiff();
            $scope.viewChangeRecommendations.setVersion($scope.motion, $scope.motion.active_version);
        });

        // Change recommendation viewing
        $scope.viewChangeRecommendations = ChangeRecommendationView;
        $scope.viewChangeRecommendations.initProjector($scope, Motion.get(motionId), $scope.mode);
    }
]);

}());
